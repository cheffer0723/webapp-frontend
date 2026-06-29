import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT || 5173),
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT || 4173),
  },
});
