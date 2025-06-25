import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            jsbi: path.resolve(__dirname, ".", "node_modules", "jsbi", "dist", "jsbi-cjs.js"),
            config: path.resolve(__dirname, "./config"),
        },
    },
});
