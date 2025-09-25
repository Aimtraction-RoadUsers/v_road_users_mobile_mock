import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react() /*, tsconfigPaths() */],
  build: {
    // Vite за замовчуванням мінімізує (esbuild). Для агресивнішого манглінгу використовуй terser:

    
    sourcemap: false, // не публікуй source maps у проді
  },
}); // Cast to Vitest's UserConfig for type checking