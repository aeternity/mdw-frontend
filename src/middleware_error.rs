use serde_json;
use std::error::Error;
use std::fmt;
use std::option::NoneError;

#[derive(Debug)]
pub struct MiddlewareError {
    details: String,
}

impl MiddlewareError {
    pub fn new(msg: &str) -> MiddlewareError {
        MiddlewareError {
            details: msg.to_string(),
        }
    }
}

impl fmt::Display for MiddlewareError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.details)
    }
}

impl std::error::Error for MiddlewareError {
    fn description(&self) -> &str {
        &self.details
    }
    fn cause(&self) -> Option<&Error> {
        // Generic error, underlying cause isn't tracked.
        None
    }
}

impl From<NoneError> for MiddlewareError {
    fn from(_none: std::option::NoneError) -> Self {
        MiddlewareError::new("None")
    }
}

impl From<r2d2::Error> for MiddlewareError {
    fn from(err: r2d2::Error) -> Self {
        MiddlewareError::new(&err.to_string())
    }
}

impl From<Box<std::error::Error>> for MiddlewareError {
    fn from(err: Box<std::error::Error>) -> Self {
        MiddlewareError::new(&err.to_string())
    }
}

impl std::convert::From<serde_json::Error> for MiddlewareError {
    fn from(err: serde_json::Error) -> Self {
        MiddlewareError::new(&err.to_string())
    }
}

impl std::convert::From<diesel::result::Error> for MiddlewareError {
    fn from(err: diesel::result::Error) -> Self {
        MiddlewareError::new(&err.to_string())
    }
}

impl std::convert::From<postgres::Error> for MiddlewareError {
    fn from(err: postgres::Error) -> Self {
        MiddlewareError::new(&err.to_string())
    }
}

pub type MiddlewareResult<T> = Result<T, MiddlewareError>;
