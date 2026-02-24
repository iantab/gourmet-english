import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // Set VITE_BASE=/repo-name/ in your GitHub Pages build environment
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api/hotpepper": {
        target: "https://webservice.recruit.co.jp",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/hotpepper/, "/hotpepper/gourmet/v1"),
      },
    },
  },
});
