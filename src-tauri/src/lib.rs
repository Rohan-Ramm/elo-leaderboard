use std::string;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn add_mult_games(input_data: String, preset_tour: bool, tour_name: String) -> Result<String,String> {
    
}

#[tauri::command]
fn add_game(winner: String, loser: String, tournament: String, date: String) -> Result<String,String> {

}

#[tauri::command]
fn export_database(export_format) -> Result<String,String> {

}

#[tauri::command]
fn import_database(input_format,input_data) -> Result<String,String> {

}

#[tauri::command]
fn find_player(player_name) -> Result<String,String> {
    
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![add_mult_games])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
