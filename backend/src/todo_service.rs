use serde::{Serialize, Deserialize};
use uuid::Uuid;
use std::sync::{Arc, Mutex};

#[derive(Serialize, Deserialize, Clone)]
pub struct Todo {
    pub id: String,
    pub title: String,
    pub done: bool,
}

#[derive(Clone)]
pub struct TodoService {
    pub items: Arc<Mutex<Vec<Todo>>>,
}

impl TodoService {
    pub fn new() -> Self {
        Self {
            items: Arc::new(Mutex::new(vec![])),
        }
    }

    pub fn add(&self, title: String) -> Todo {
        let todo = Todo {
            id: Uuid::new_v4().to_string(),
            title,
            done: false,
        };
        self.items.lock().unwrap().push(todo.clone());
        todo
    }

    pub fn list(&self) -> Vec<Todo> {
        self.items.lock().unwrap().clone()
    }

    pub fn toggle(&self, id: String) -> Option<Todo> {
        let mut items = self.items.lock().unwrap();
        for t in items.iter_mut() {
            if t.id == id {
                t.done = !t.done;
                return Some(t.clone());
            }
        }
        None
    }
}
