#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod structs;
mod api;
use api::{compile_tex, open_folder, save_file, open_file};

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      compile_tex,
      open_folder,
      save_file,
      open_file
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
