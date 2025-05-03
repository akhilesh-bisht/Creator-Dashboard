import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: isProduction
          ? "https://creator-dashboard-s7bl.onrender.com"
          : "http://localhost:4500", // Local URL for development
        changeOrigin: true,
        secure: false, // Useful for HTTP APIs (in dev)
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove the /api prefix
      },
    },
  },
});
