import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "devextreme/ui": "devextreme/esm/ui",
    },
  },
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // '/notification': {
      //  target: 'http://localhost:5272',
      //  changeOrigin: true,
      //  ws: true,
      // },
    },
  },
});
