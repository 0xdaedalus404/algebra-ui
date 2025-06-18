import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            jsbi: path.resolve(__dirname, ".", "node_modules", "jsbi", "dist", "jsbi-cjs.js"),
            config: path.resolve(__dirname, "./config"),
        },
    },
});
