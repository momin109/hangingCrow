import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: parseInt(process.env.VITE_PORT || '3001'),
        host: process.env.VITE_HOST || 'localhost',
        proxy: {
            "/api": {
                target: process.env.VITE_API_URL || "http://localhost:3000",
                changeOrigin: true,
                secure: false,
            }
        }
    }
});
