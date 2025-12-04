import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// saída em ../frontend/dist
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist",
    },
});
