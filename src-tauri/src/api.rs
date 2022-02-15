use std::fs;
use std::process::Command;
use tauri::api::dialog::blocking::FileDialogBuilder;
use crate::structs::Response;

#[tauri::command]
pub fn compile_tex(fname: &str, outdir: &str) -> Response<Vec<u8>> {
  let compile = Command::new("latexmk")
    .arg("-pdf")
    .arg(format!("-outdir={}", outdir))
    .arg(format!("{}", fname))
    .output();
  match compile {
    Ok(_) => {},
    Err(_) => {
      // Probably should do some handling of this :(
    }
  };
  // Now clean the intermediary files
  let clean = Command::new("latexmk")
    .arg("-c")
    .current_dir(outdir)
    .output();
  match clean {
    Ok(_) => {},
    Err(_) => {
      // Probably should do some handling of this :(
    }
  };
  match fs::read(format!("{}/main.pdf", outdir)) {
    Ok(data) => { Response::success(data) },
    Err(e) => { Response::error(vec![], e.to_string()) }
  }
}

#[tauri::command(async)]
pub fn open_folder() -> Response<(String, Vec<String>)> {
  let mut dir = String::from("");
  let mut files: Vec<String> = Vec::new();
  match FileDialogBuilder::new().pick_folder() {
    Some(path) => {
      dir = path.to_string_lossy().to_string();
      match fs::read_dir(path) {
        Ok(directory) => {
          for entry in directory {
            match entry {
              Ok(entry) => {
                files.push(entry.path().to_string_lossy().to_string());
              },
              Err(_) => {}
            };
          }
          Response::success((dir, files))
        },
        Err(_) => {
          Response::error((dir, files), String::from("Error reading the chosen directory"))
        }
      }
    },
    None => {
      Response::error((dir, files), String::from("Error picking folder"))
    }
  }
}

#[tauri::command]
pub fn save_file(fname: &str, contents: &str) -> Response<String>{
  match fs::write(fname, contents) {
    Ok(_) => Response::success(String::from("")),
    Err(e) => Response::error(e.to_string(), String::from("Error saving file"))
  }
}

#[tauri::command]
pub fn open_file(fname: &str) -> Response<String> {
  match fs::read_to_string(fname) {
    Ok(contents) => Response::success(contents),
    Err(e) => Response::error(e.to_string(), String::from("Error opening file"))
  }
}