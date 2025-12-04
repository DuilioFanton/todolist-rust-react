########### STAGE 1 — Build do React ###########
FROM node:lts AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


########### STAGE 2 — Build do Rust ###########
FROM rust:latest AS backend-builder

WORKDIR /app/backend

# Copia arquivos de config primeiro (cache)
COPY backend/Cargo.toml backend/Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copia o backend real
COPY backend/ ./
RUN cargo build --release


########### STAGE 3 — Imagem final ###########
FROM debian:bookworm-slim

WORKDIR /app

# Copia binário do Rust
COPY --from=backend-builder /app/backend/target/release/backend ./backend

# Copia build do React
COPY --from=frontend-builder /app/frontend/dist ./dist

# Backend servirá os arquivos da SPA (dist/)
EXPOSE 3000

CMD ["./backend"]
