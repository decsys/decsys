import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config as loadEnv } from "dotenv";
import { env } from "process";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react(), tsconfigPaths()],
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
      },
    },
  };

  switch (mode) {
    case "development": {
      // `.aspnet/aspnetcore-react` writes dev-cert details to this file
      loadEnv({ path: ".env.development.local" });

      const proxyTarget = env.ASPNETCORE_HTTPS_PORT
        ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
        : env.ASPNETCORE_URLS
        ? env.ASPNETCORE_URLS.split(";")[0]
        : "https://localhost:7789";

      return {
        ...config,
        server: {
          port: 45789,
          https: {
            key: env.SSL_KEY_FILE,
            cert: env.SSL_CRT_FILE,
          },
          proxy: {
            // most backend routes are here
            "/api": {
              target: proxyTarget,
              secure: false,
            },
            // DECSYS serves components (and survey images?) from here
            "/static": {
              target: proxyTarget,
              secure: false,
            },
            // This is all OIDC / Account related
            "/.well-known": {
              target: proxyTarget,
              secure: false,
            },
            "/Account": {
              target: proxyTarget,
              secure: false,
            },
            "/connect": {
              target: proxyTarget,
              secure: false,
            },
            // General backend Error route
            "/error": {
              target: proxyTarget,
              secure: false,
            },
            // Swagger defination
            "/swagger": {
              target: proxyTarget,
              secure: false,
            },
          },
        },
      };
    }
    default:
      return config;
  }
});
