use tauri_plugin_sql::{Migration, MigrationKind}; 

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

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
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
