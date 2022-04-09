use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub struct Annotation {
  pub row: u32,
  pub column: u32,
  pub text: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub struct Response<T> {
  status: String,
  body: T,
  message: String,
}

impl<T> Response<T> {
  pub fn success(body: T) -> Response<T> {
    Response { status: String::from("success"), body, message: String::from("")}
  }

  pub fn error(body: T, message: String) -> Response<T> {
    Response { status: String::from("error"), body, message}
  }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json;

    #[test]
    fn it_creates_success_response() {
        let res = Response::success("test body");
        assert_eq!(res.status, "success");
        assert_eq!(res.body, "test body");
        assert_eq!(res.message, "");
    }

    #[test]
    fn it_creates_error_response() {
        let res = Response::error("test body", "error message".to_string());
        assert_eq!(res.status, "error");
        assert_eq!(res.body, "test body");
        assert_eq!(res.message, "error message");
    }

    #[test]
    fn it_serializes_deserializes_response() {
      let res = Response::success("test body");
      assert_eq!(res, serde_json::from_str(&serde_json::to_string(&res).unwrap()).unwrap());
    }
}