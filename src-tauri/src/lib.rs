use tauri_plugin_sql::{Migration, MigrationKind}; 
use std::string;

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
    let migrations = vec![
        Migration {
            version: 1,
            description: "player_table",
            sql: "CREATE TABLE players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                wins INTEGER NOT NULL DEFAULT 0,
                losses INTEGER NOT NULL DEFAULT 0,
                elo REAL NOT NULL DEFAULT 1000.0
            );
            CREATE TABLE matches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                winner_id INTEGER NOT NULL REFERENCES players(id),
                loser_id INTEGER NOT NULL REFERENCES players(id),
                tournament_name TEXT NOT NULL,
                date TEXT NOT NULL
            );",
            kind: MigrationKind::Up,
        }, 
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default()
                    .add_migrations("sqlite:mydatabase.db",migrations)
                    .build(),)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![add_game,add_mult_games,export_database,import_database,find_player,get_leaderboard])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
