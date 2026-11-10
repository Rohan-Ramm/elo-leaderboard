use crate::{BackendMatch, Player};
use serde::Deserialize;
use sqlx::SqlitePool;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::Path;
use tauri::State;

/// One line of a JSON Lines import. The owned counterpart of `ExportRow`: the
/// `"type"` field picks which variant the rest of the line is read into.
#[derive(Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
enum ImportRow {
    Player(Player),
    Match(BackendMatch),
}

#[tauri::command]
pub async fn import_database(
    pool: State<'_, SqlitePool>,
    file_name: String,
    file_type: String,
) -> Result<String, String> {
    if file_type != "json" && file_type != "csv" {
        return Err(format!("Unsupported import type: {file_type}"));
    }

    let mut tx = pool.begin().await.map_err(|e| e.to_string())?;

    let result = match clear_database(&mut tx).await {
        Err(e) => Err(e),
        Ok(()) if file_type == "json" => import_json_database(&mut tx, &file_name).await,
        Ok(()) => import_csv_database(&mut tx, &file_name).await,
    };

    match result {
        Ok((player_count, match_count)) => {
            tx.commit().await.map_err(|e| e.to_string())?;
            Ok(format!(
                "Imported {player_count} players and {match_count} matches"
            ))
        }
        Err(e) => {
            let _ = tx.rollback().await;
            Err(e)
        }
    }
}

async fn import_json_database(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    file_name: &str,
) -> Result<(usize, usize), String> {
    let file = File::open(file_name).map_err(|e| e.to_string())?;
    let reader = BufReader::new(file);

    let (mut player_count, mut match_count) = (0, 0);
    for (index, line) in reader.lines().enumerate() {
        let line_number = index + 1;
        let line = line.map_err(|e| format!("Line {line_number}: {e}"))?;
        if line.trim().is_empty() {
            continue;
        }

        let row: ImportRow =
            serde_json::from_str(&line).map_err(|e| format!("Line {line_number}: {e}"))?;
        match row {
            ImportRow::Player(player) => {
                insert_player(tx, &player)
                    .await
                    .map_err(|e| format!("Line {line_number}: {e}"))?;
                player_count += 1;
            }
            ImportRow::Match(game) => {
                insert_match(tx, &game)
                    .await
                    .map_err(|e| format!("Line {line_number}: {e}"))?;
                match_count += 1;
            }
        }
    }

    Ok((player_count, match_count))
}

async fn import_csv_database(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    folder_name: &str,
) -> Result<(usize, usize), String> {
    let folder = Path::new(folder_name);

    let mut players_csv = csv::Reader::from_path(folder.join("players.csv"))
        .map_err(|e| format!("players.csv: {e}"))?;
    let mut matches_csv = csv::Reader::from_path(folder.join("matches.csv"))
        .map_err(|e| format!("matches.csv: {e}"))?;

    // Players first, so every match's winner_id and loser_id already exist
    let mut player_count = 0;
    for (index, record) in players_csv.deserialize::<Player>().enumerate() {
        let line_number = index + 2;
        let player = record.map_err(|e| format!("players.csv line {line_number}: {e}"))?;
        insert_player(tx, &player)
            .await
            .map_err(|e| format!("players.csv line {line_number}: {e}"))?;
        player_count += 1;
    }

    let mut match_count = 0;
    for (index, record) in matches_csv.deserialize::<BackendMatch>().enumerate() {
        let line_number = index + 2;
        let game = record.map_err(|e| format!("matches.csv line {line_number}: {e}"))?;
        insert_match(tx, &game)
            .await
            .map_err(|e| format!("matches.csv line {line_number}: {e}"))?;
        match_count += 1;
    }

    Ok((player_count, match_count))
}

async fn clear_database(tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>) -> Result<(), String> {
    // Matches first, because they reference players.
    sqlx::query("DELETE FROM matches")
        .execute(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    sqlx::query("DELETE FROM players")
        .execute(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    // Reset the AUTOINCREMENT counters
    sqlx::query("DELETE FROM sqlite_sequence WHERE name IN ('players', 'matches')")
        .execute(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

/// Inserts a player exactly as exported
async fn insert_player(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    player: &Player,
) -> Result<(), String> {
    sqlx::query("INSERT INTO players (id, name, wins, losses, elo) VALUES (?, ?, ?, ?, ?)")
        .bind(player.id)
        .bind(&player.name)
        .bind(player.wins)
        .bind(player.losses)
        .bind(player.elo)
        .execute(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

/// Inserts a match exactly as exported.
// Different from add_game this is for importing a stored database
async fn insert_match(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    game: &BackendMatch,
) -> Result<(), String> {
    if game.winner_id == game.loser_id {
        return Err("A player cannot play against themselves".into());
    }
    sqlx::query(
        "INSERT INTO matches (id, winner_id, loser_id, tournament_name, date)
         VALUES (?, ?, ?, ?, ?)",
    )
    .bind(game.id)
    .bind(game.winner_id)
    .bind(game.loser_id)
    .bind(&game.tournament_name)
    .bind(&game.date)
    .execute(&mut **tx)
    .await
    .map_err(|e| e.to_string())?;
    Ok(())
}
