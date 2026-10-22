use std::string;
use sqlx::{
    sqlite::{SqliteConnectOptions, SqlitePoolOptions},
    SqlitePool,
};
use std::{fs, str::FromStr};
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn add_mult_games(input_data: String, preset_tour: bool, tour_name: String) -> Result<String,String> {
    Ok("Good".to_string())
}

#[tauri::command]
fn add_game(winner: String, loser: String, tournament: String, date: String) -> Result<String,String> {
    Ok("Good".to_string())
}

#[tauri::command]
fn export_database(export_format: String) -> Result<String,String> {
    Ok("Good".to_string())
}

#[tauri::command]
fn import_database(input_format: String,input_data: String) -> Result<String,String> {
    Ok("Good".to_string())
}

#[tauri::command]
fn find_player(player_name: String) -> Result<String,String> {
    Ok("Good".to_string())
}

#[tauri::command]
fn get_leaderboard(preferences: String) -> Result<String,String> {
    Ok("Good".to_string())
}

fn calculateNewElo(winner_elo: u16, loser_elo: u16, k_factor: u8) -> (u16,u16) {
    return (5,5)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Get the application's data directory.
            let app_data_dir = app.path().app_data_dir()?;
            fs::create_dir_all(&app_data_dir)?;

            let db_path = app_data_dir.join("mydatabase.db");

            // Configure SQLite.
            let options = SqliteConnectOptions::from_str(
                &format!("sqlite:{}", db_path.display())
            )?
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
            add_game,
            add_mult_games,
            export_database,
            import_database,
            find_player,
            get_leaderboard
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}