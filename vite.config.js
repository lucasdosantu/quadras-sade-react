import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "./package.json";

export default defineConfig({
  plugins: [react()],
  base: "/quadras-sade-react/",
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
});
