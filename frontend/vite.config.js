import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Determine if the current environment is production or development
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: isProduction
          ? "https://creator-dashboard-s7bl.onrender.com" // Production API
          : "http://localhost:4500", // Development API
        changeOrigin: true,
        secure: false, // Set to `true` if the target uses https
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove `/api` prefix
      },
    },
  },
});
