mod routes;
mod todo_service;

use axum::{
    Router,
};
use tower_http::services::ServeDir;
use todo_service::TodoService;
use std::net::TcpListener as StdTcpListener;

#[tokio::main]
async fn main() {
    let service = TodoService::new();

    // Rota da API
    let api_routes = routes::routes(service);

    // Servindo arquivos estáticos do React (dist/)
    // No container final, os arquivos são copiados para /app/dist (ver Dockerfile).
    // Usamos um caminho relativo ao WORKDIR (/app), portanto apenas "dist".
    let dist_dir = ServeDir::new("dist");

    let app = Router::new()
        .nest("/api", api_routes)       // API
        .fallback_service(dist_dir);    // SPA e estáticos

    println!("Rodando em http://localhost:3000");

    // axum 0.8: use std::net::TcpListener e converta para o tipo do Tokio
    let std_listener = StdTcpListener::bind("0.0.0.0:3000").expect("falha ao bindar porta 3000");
    std_listener
        .set_nonblocking(true)
        .expect("falha ao tornar listener non-blocking");
    let listener = tokio::net::TcpListener::from_std(std_listener).expect("falha ao converter listener");

    // Inicia o servidor HTTP e bloqueia a thread enquanto estiver rodando
    axum::serve(listener, app).await.expect("servidor terminou inesperadamente");
}
