import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative asset paths, so the build works at a domain root or in a sub-folder (e.g. GitHub Pages).
  base: "./",
});
