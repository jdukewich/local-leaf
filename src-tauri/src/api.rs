use std::fs;
use std::str;
use std::process::Command;
use fancy_regex::Regex;
use tauri::api::dialog::blocking::FileDialogBuilder;
use crate::structs::{Annotation,Response};

#[tauri::command]
pub fn compile_tex(fname: &str, outdir: &str) -> Response<(Vec<u8>, Vec<Annotation>)> {
  let mut errors: Vec<Annotation> = Vec::new();
  let compile = Command::new("latexmk")
    .arg("-pdf")
    .arg("-interaction=nonstopmode")
    .arg("-g")
    .arg(format!("-outdir={}", outdir))
    .arg(format!("{}", fname))
    .output();
  match compile {
    Ok(results) => {
      // Look for "\r\n!" which indicates an error in the output
      match str::from_utf8(&results.stdout) {
        Ok(output) => {
          let re = Regex::new(r"\r\n!.*\r\n.*\r\n").unwrap();
          for cap in re.captures_iter(output) {
            match cap {
              Ok(capture) => {
                let split: Vec<&str> = (&capture[0]).trim().split("\r\n").collect();
                let err_re = Regex::new(r"(?<=[!\s]).*").unwrap();
                let loc_re = Regex::new(r"(?<=[\d\.])(\d*)(?=\s)").unwrap();
                let err = err_re.find(&split[0]).unwrap().unwrap().as_str();
                let location = loc_re.find(&split[1]).unwrap().unwrap().as_str().parse::<u32>().unwrap();
                errors.push(Annotation { row: location - 1, column: 0, text: err.to_string()});
              },
              Err(_) => {}
            }
          }
        },
        Err(_) => {}
      }
    },
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
    Ok(data) => { Response::success((data, errors)) },
    Err(e) => { Response::error((vec![], vec![]), e.to_string()) }
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