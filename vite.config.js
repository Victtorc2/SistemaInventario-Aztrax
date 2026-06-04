import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Configuración de Vite con alias "@" -> src para imports limpios.
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5173,
    },
});
