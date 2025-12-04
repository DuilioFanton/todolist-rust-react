use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;

use crate::todo_service::{TodoService, Todo};

#[derive(Deserialize)]
pub struct NewTodo {
    pub title: String,
}

pub fn routes(service: TodoService) -> Router {
    Router::new()
        .route("/todos", get(list).post(create))
        .route("/todos/{id}/toggle", post(toggle))
        .with_state(service)
}

async fn list(State(service): State<TodoService>) -> Json<Vec<Todo>> {
    Json(service.list())
}

async fn create(
    State(service): State<TodoService>,
    Json(payload): Json<NewTodo>
) -> Json<Todo> {
    Json(service.add(payload.title))
}

async fn toggle(
    Path(id): Path<String>,
    State(service): State<TodoService>,
) -> Result<Json<Todo>, StatusCode> {
    match service.toggle(id) {
        Some(todo) => Ok(Json(todo)),
        None => Err(StatusCode::NOT_FOUND),
    }
}
