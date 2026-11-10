mod export;
mod import;

use serde::{Deserialize, Serialize};
use sqlx::{
    sqlite::{SqliteConnectOptions, SqlitePoolOptions},
    FromRow, SqlitePool,
};
use std::collections::HashMap;
use std::string;
use std::{fs, str::FromStr};
use tauri::{Manager, State};

#[derive(FromRow, Serialize, Deserialize)]
struct Player {
    id: i64,
    name: String,
    wins: i64,
    losses: i64,
    elo: f64,
}

#[derive(FromRow, Serialize, Deserialize)]
pub struct BackendMatch {
    pub id: i64,
    pub winner_id: i64,
    pub loser_id: i64,
    pub tournament_name: String,
    pub date: String,

    // Not columns of the matches table. They are filled in only when a query
    // joins in the player names (`... AS winner_name`); otherwise sqlx leaves
    // them as None and they are left out of the serialized output, so the JSON
    // export doesn't include them but the CSV export does. On import they are
    // read if present (CSV) but never stored: the ids are what link a match to
    // its players.
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub winner_name: Option<String>,
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub loser_name: Option<String>,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct FrontendMatch {
    pub winner_name: String,
    pub loser_name: String,
    pub tournament_name: String,
    pub date: String,
}

#[tauri::command]
async fn add_games(pool: State<'_, SqlitePool>, input_data: String) -> Result<String, String> {
    let mut tx = pool.begin().await.map_err(|e| e.to_string())?;

    let incoming_games: Vec<FrontendMatch> =
        serde_json::from_str(&input_data).map_err(|e| e.to_string())?;
    for game in &incoming_games {
        add_game_to_database(&mut tx, game).await?;
    }
    tx.commit().await.map_err(|e| e.to_string())?;
    Ok("Success".to_string())
}

/// Inserts a new game to the databse
// Different from insert_match, this adds a new match to the stored databse
async fn add_game_to_database(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    game: &FrontendMatch,
) -> Result<String, String> {
    if game.winner_name == game.loser_name {
        return Err("A player cannot play against themselves".into());
    }
    // insert or ignore player one
    sqlx::query("INSERT OR IGNORE INTO players (name) VALUES (?)")
        .bind(&game.winner_name)
        .execute(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    // insert or ignore player two
    sqlx::query("INSERT OR IGNORE INTO players (name) VALUES (?)")
        .bind(&game.loser_name)
        .execute(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    // get elo from players 1 and 2
    let current_winner_elo = sqlx::query_scalar("SELECT elo FROM players WHERE name = ?;")
        .bind(&game.winner_name)
        .fetch_one(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    let current_loser_elo = sqlx::query_scalar("SELECT elo FROM players WHERE name = ?;")
        .bind(&game.loser_name)
        .fetch_one(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    // calculate new elos
    let (new_winner_elo, new_loser_elo) =
        calculate_new_elo(current_winner_elo, current_loser_elo, 32.0);
    // update scores
    sqlx::query("UPDATE players SET wins = wins + 1, elo = ? WHERE NAME = ?;")
        .bind(new_winner_elo)
        .bind(&game.winner_name)
        .execute(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    sqlx::query("UPDATE players SET losses = losses + 1, elo = ? WHERE NAME = ?;")
        .bind(new_loser_elo)
        .bind(&game.loser_name)
        .execute(&mut **tx)
        .await
        .map_err(|e| e.to_string())?;
    // insert game into matches
    sqlx::query(
        "INSERT INTO matches (winner_id, loser_id, tournament_name, date) VALUES (
        (SELECT id FROM players WHERE name = ?),
        (SELECT id FROM PLAYERS WHERE name = ?),
        (?),
        (?))",
    )
    .bind(&game.winner_name)
    .bind(&game.loser_name)
    .bind(&game.tournament_name)
    .bind(&game.date)
    .execute(&mut **tx)
    .await
    .map_err(|e| e.to_string())?;
    Ok("Good".to_string())
}

#[tauri::command]
async fn find_player(pool: State<'_, SqlitePool>, name: String) -> Result<Option<Player>, String> {
    sqlx::query_as::<_, Player>(
        "SELECT id, name, wins, losses, elo
         FROM players
         WHERE name = ?",
    )
    .bind(name)
    .fetch_optional(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
async fn find_assc_matches(
    pool: State<'_, SqlitePool>,
    name: String,
) -> Result<Vec<FrontendMatch>, String> {
    sqlx::query_as::<_, FrontendMatch>(
        "SELECT 
            winner.name AS winner_name,
            loser.name AS loser_name,
            matches.tournament_name AS tournament_name,
            matches.date AS date
         FROM players AS winner
         INNER JOIN matches ON (winner.id = matches.winner_id)
         INNER JOIN players AS loser ON (loser.id = matches.loser_id)
         WHERE winner.name = ? OR loser.name = ?
         ORDER BY matches.date DESC
         LIMIT 4",
    )
    .bind(&name)
    .bind(&name)
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_leaderboard(
    pool: State<'_, SqlitePool>,
    preferences: String,
) -> Result<Vec<Player>, String> {
    let settings: HashMap<String, String> =
        serde_json::from_str(&preferences).map_err(|e| e.to_string())?;
    //whitelist allowed names
    let query = match settings["category"].as_str() {
        "elo" => "SELECT * FROM players ORDER BY elo DESC LIMIT ?",
        "wins" => "SELECT * FROM players ORDER BY wins DESC LIMIT ?",
        "losses" => "SELECT * FROM players ORDER BY losses DESC LIMIT ?",
        "name" => "SELECT * FROM players ORDER BY name DESC LIMIT ?",
        _ => return Err("Invalid sort category".to_string()),
    };

    sqlx::query_as::<_, Player>(query)
        .bind(&settings["count"])
        .fetch_all(pool.inner())
        .await
        .map_err(|e| e.to_string())
}

fn calculate_new_elo(winner_elo: f64, loser_elo: f64, k_factor: f64) -> (f64, f64) {
    let expected_winner = 1.0 / (1.0 + 10.0_f64.powf((loser_elo - winner_elo) / 400.0));
    let expected_loser = 1.0 / (1.0 + 10.0_f64.powf((winner_elo - loser_elo) / 400.0));

    let new_winner_elo = (winner_elo + k_factor * (1.0 - expected_winner)).round();
    let new_loser_elo = (loser_elo + k_factor * (0.0 - expected_loser)).round();

    (new_winner_elo, new_loser_elo)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Get the application's data directory.
            let app_data_dir = app.path().app_data_dir()?;
            fs::create_dir_all(&app_data_dir)?;

            let db_path = app_data_dir.join("mydatabase.db");

            // Configure SQLite.
            let options = SqliteConnectOptions::from_str(&format!("sqlite:{}", db_path.display()))?
                .create_if_missing(true)
                .foreign_keys(true);

            // Initialize the connection pool and schema.
            let pool = tauri::async_runtime::block_on(async {
                let pool = SqlitePoolOptions::new()
                    .max_connections(5)
                    .connect_with(options)
                    .await?;

                sqlx::raw_sql(
                    r#"
                    CREATE TABLE IF NOT EXISTS players (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL UNIQUE,
                        wins INTEGER NOT NULL DEFAULT 0,
                        losses INTEGER NOT NULL DEFAULT 0,
                        elo REAL NOT NULL DEFAULT 1000.0
                    );

                    CREATE TABLE IF NOT EXISTS matches (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        winner_id INTEGER NOT NULL
                            REFERENCES players(id),
                        loser_id INTEGER NOT NULL
                            REFERENCES players(id),
                        tournament_name TEXT NOT NULL,
                        date TEXT NOT NULL
                    );
                    "#,
                )
                .execute(&pool)
                .await?;

                Ok::<SqlitePool, sqlx::Error>(pool)
            })?;

            // Make the pool available to every Tauri command.
            app.manage(pool);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            add_games,
            export::export_database,
            import::import_database,
            find_player,
            get_leaderboard,
            find_assc_matches
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
