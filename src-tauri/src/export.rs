use crate::{BackendMatch, Player};
use futures_util::{Stream, TryStreamExt};
use serde::Serialize;
use sqlx::SqlitePool;
use std::fs::{self, File};
use std::io::{BufWriter, Write};
use std::path::Path;
use tauri::State;

/// One line of a JSON Lines export.
#[derive(Serialize)]
#[serde(tag = "type", rename_all = "lowercase")]
enum ExportRow<'a> {
    Player(&'a Player),
    Match(&'a BackendMatch),
}

#[tauri::command]
pub async fn export_database(
    pool: State<'_, SqlitePool>,
    file_name: String,
    file_type: String,
) -> Result<String, String> {
    if file_type == "json" {
        export_json_database(pool.inner(), &file_name).await
    } else if file_type == "csv" {
        export_csv_database(pool.inner(), &file_name).await
    } else {
        Err(format!("Unsupported export type: {file_type}"))
    }
}

async fn export_json_database(pool: &SqlitePool, file_name: &str) -> Result<String, String> {
    let final_path = Path::new(file_name);
    let temp_path = final_path.with_file_name(format!( //we protect the final path by first writing to temp path
        "{}.part",
        final_path
            .file_name()
            .ok_or("Invalid export file name")?
            .to_string_lossy()
    ));

    if let Err(e) = create_json_export(pool, &temp_path).await {
        let _ = fs::remove_file(&temp_path);
        return Err(e);
    }
    fs::rename(&temp_path, final_path).map_err(|e| e.to_string())?;

    Ok(format!("Exported database to {file_name}"))
}

async fn create_json_export(pool: &SqlitePool, path: &Path) -> Result<(), String> {
    let file = File::create(path).map_err(|e| e.to_string())?;
    let mut out = BufWriter::new(file);

    // Read both tables inside one transaction
    let mut tx = pool.begin().await.map_err(|e| e.to_string())?;

    let players = sqlx::query_as::<_, Player>(
        "SELECT id, name, wins, losses, elo FROM players ORDER BY id",
    )
    .fetch(&mut *tx);
    json_rows_writer(&mut out, players, |row| ExportRow::Player(row)).await?;

    let matches = sqlx::query_as::<_, BackendMatch>(
        "SELECT id, winner_id, loser_id, tournament_name, date FROM matches ORDER BY id",
    )
    .fetch(&mut *tx);
    json_rows_writer(&mut out, matches, |row| ExportRow::Match(row)).await?;

    out.flush().map_err(|e| e.to_string())?;
    tx.rollback().await.map_err(|e| e.to_string())?;
    Ok(())
}

/// Streams rows from the database and writes each one, tagged by `tag`, as a
/// JSON object on its own line.
async fn json_rows_writer<T, S, F>(out: &mut impl Write, mut rows: S, tag: F) -> Result<(), String>
where
    S: Stream<Item = Result<T, sqlx::Error>> + Unpin,
    F: for<'a> Fn(&'a T) -> ExportRow<'a>,
{
    while let Some(row) = rows.try_next().await.map_err(|e| e.to_string())? {
        serde_json::to_writer(&mut *out, &tag(&row)).map_err(|e| e.to_string())?;
        out.write_all(b"\n").map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Creates a folder with two files
async fn export_csv_database(pool: &SqlitePool, folder_name: &str) -> Result<String, String> {
    let folder = Path::new(folder_name);
    let created_folder = !folder.exists();
    fs::create_dir_all(folder).map_err(|e| e.to_string())?;

    // Same protection as the JSON export
    let players_part = folder.join("players.csv.part");
    let matches_part = folder.join("matches.csv.part");

    if let Err(e) = create_csv_export(pool, &players_part, &matches_part).await {
        let _ = fs::remove_file(&players_part);
        let _ = fs::remove_file(&matches_part);
        if created_folder {
            // Only succeeds if the folder is empty, so it never deletes anything else
            let _ = fs::remove_dir(folder);
        }
        return Err(e);
    }
    fs::rename(&players_part, folder.join("players.csv")).map_err(|e| e.to_string())?;
    fs::rename(&matches_part, folder.join("matches.csv")).map_err(|e| e.to_string())?;

    Ok(format!("Exported database to {folder_name}"))
}

async fn create_csv_export(
    pool: &SqlitePool,
    players_path: &Path,
    matches_path: &Path,
) -> Result<(), String> {
    // Read both tables inside one transaction
    let mut tx = pool.begin().await.map_err(|e| e.to_string())?;

    let players = sqlx::query_as::<_, Player>(
        "SELECT id, name, wins, losses, elo FROM players ORDER BY id",
    )
    .fetch(&mut *tx);
    csv_rows_writer(players_path, players).await?;

    let matches = sqlx::query_as::<_, BackendMatch>(
        "SELECT
            matches.id AS id,
            matches.winner_id AS winner_id,
            matches.loser_id AS loser_id,
            matches.tournament_name AS tournament_name,
            matches.date AS date,
            winner.name AS winner_name,
            loser.name AS loser_name
         FROM matches
         INNER JOIN players AS winner ON winner.id = matches.winner_id
         INNER JOIN players AS loser ON loser.id = matches.loser_id
         ORDER BY matches.id",
    )
    .fetch(&mut *tx);
    csv_rows_writer(matches_path, matches).await?;

    tx.rollback().await.map_err(|e| e.to_string())?;
    Ok(())
}

async fn csv_rows_writer<T, S>(path: &Path, mut rows: S) -> Result<(), String>
where
    T: Serialize,
    S: Stream<Item = Result<T, sqlx::Error>> + Unpin,
{
    let mut out = csv::Writer::from_path(path).map_err(|e| e.to_string())?;
    while let Some(row) = rows.try_next().await.map_err(|e| e.to_string())? {
        out.serialize(&row).map_err(|e| e.to_string())?;
    }
    out.flush().map_err(|e| e.to_string())?;
    Ok(())
}
