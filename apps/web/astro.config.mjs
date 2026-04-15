/* eslint-env node */
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import { URL, fileURLToPath } from "node:url"

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  integrations: [react()],
  srcDir: "src",
  publicDir: "public",
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
})
