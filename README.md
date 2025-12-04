# Todolist — Rust + React

Aplicação full‑stack simples de lista de tarefas (ToDo), com backend em Rust (Axum) e frontend em React (Vite + TypeScript). O projeto foi pensado para ser executado facilmente via Docker, mas também é possível rodar localmente para desenvolvimento.

Sumário

- Visão geral
- Tecnologias
- Pré‑requisitos
- Como rodar (Docker)
- Como rodar localmente (sem Docker)
- API
- Estrutura do projeto
- Comandos úteis

Visão geral
Este projeto expõe uma API REST muito simples para gerenciar tarefas e serve a SPA construída no diretório dist. Em produção (imagem Docker final), o binário do backend serve tanto a API quanto os arquivos estáticos do frontend na mesma porta.

Tecnologias

- Backend: Rust 1.78+ (Axum, Tokio, Tower HTTP, Serde, UUID)
- Frontend: React 19, Vite 7, TypeScript 5, Tailwind CSS
- Containerização: Docker multi‑stage + docker‑compose

Pré‑requisitos
Escolha uma das opções:

- Executar com Docker (recomendado)
    - Docker 24+ e Docker Compose
- Executar localmente
    - Rust toolchain (cargo) instalado
    - Node.js LTS (npm) instalado

Como rodar (Docker)

1. Na raiz do projeto, execute:
   docker compose up --build

2. Acesse a aplicação:
   http://localhost:3000

Observações

- O docker-compose cria um único serviço (app) que builda o frontend e o backend e expõe a porta 3000.
- Variáveis de ambiente: RUST_LOG=info (ajuste no docker-compose.yml conforme necessário).

Como rodar localmente (sem Docker)
Há duas formas principais.

Opção A — Rodar tudo com build do frontend servida pelo backend

1. Build do frontend
   cd frontend
   npm install
   npm run build

2. Copie o build para a raiz do repositório como dist/ (o backend procura por "dist" no diretório atual do processo)
   cd .. # volte para a raiz do projeto
   rm -rf dist && cp -r frontend/dist ./dist

3. Compile o backend (modo release recomendado) e rode o binário a partir da RAIZ do projeto
   cd backend
   cargo build --release
   cd ..
   ./backend/target/release/backend

4. Acesse em http://localhost:3000

Observação importante sobre o diretório dist

- O backend está configurado para servir arquivos estáticos de um diretório chamado "dist" relativo ao diretório de trabalho atual do processo. Por isso, ao rodar localmente, garanta que exista um diretório dist/ na RAIZ do projeto quando executar o binário.

Opção B — Rodar serviços separados somente para desenvolvimento

- Backend (porta 3000):
  cd backend
  cargo run

- Frontend (Vite dev server, porta 5173 por padrão):
  cd frontend
  npm install
  npm run dev

  Importante: o frontend consome a API usando caminhos relativos ("/api"). Para funcionar no modo dev do Vite, é necessário configurar um proxy em vite.config.ts para encaminhar "/api" para http://localhost:3000, ou alterar temporariamente as URLs de acesso à API. Caso contrário, prefira a Opção A ou o uso de Docker.

API
Base URL (Docker e Opção A): http://localhost:3000/api

Model
Todo {
id: string, // UUID v4
title: string,
done: boolean
}

Endpoints

- GET /api/todos
  Retorna a lista de todos.

  Exemplo:
  curl http://localhost:3000/api/todos

- POST /api/todos
  Cria um novo todo.
  Body JSON: { "title": "Comprar pão" }

  Exemplo:
  curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar pão"}'

- POST /api/todos/{id}/toggle
  Alterna o campo done do todo com o id informado.
  Respostas: 200 com o todo atualizado ou 404 se não encontrado.

  Exemplo:
  curl -X POST http://localhost:3000/api/todos/<ID>

Estrutura do projeto
.
├─ backend/ # Código do servidor (Axum)
│ ├─ src/
│ │ ├─ main.rs # Sobe o servidor em :3000, serve /api e fallback para dist/
│ │ ├─ routes.rs # Rotas da API
│ │ └─ todo_service.rs # Lógica em memória para TODOs
│ └─ Cargo.toml
├─ frontend/ # SPA React (Vite + TS + Tailwind)
│ ├─ src/
│ ├─ index.html
│ ├─ package.json
│ └─ vite.config.ts
├─ Dockerfile # Build multi‑stage (frontend + backend) e imagem final
├─ docker-compose.yml # Sobe o serviço app na porta 3000
└─ README.md

Comandos úteis

- Docker (build + run):
  docker compose up --build
  docker compose down

- Backend:
  cd backend && cargo run # modo dev
  cd backend && cargo build --release

- Frontend:
  cd frontend && npm run dev # modo dev (requer proxy para /api)
  cd frontend && npm run build
  cd frontend && npm run preview

Troubleshooting

- Porta ocupada: verifique se nada está usando a 3000 (ou ajuste a porta conforme necessário no código e compose).
- dist não encontrado ao rodar localmente: siga a Opção A para garantir que o diretório dist/ exista na raiz ao iniciar o backend.
- CORS no dev server do Vite: configure um proxy para "/api" apontando para http://localhost:3000.

Licença
Não há licença explicitada neste repositório.
