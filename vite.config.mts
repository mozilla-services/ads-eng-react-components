import { resolve } from "node:path"
import reactSwc from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

// Anything a consumer already has installed stays out of the bundle. Keeping React,
// MUI, Emotion and Axios external is what prevents duplicate-instance bugs (two React
// copies, two Emotion caches, an Axios without the app's auth interceptors).
const externalPackages = [
  "@emotion/react",
  "@emotion/styled",
  "@mui/icons-material",
  "@mui/lab",
  "@mui/material",
  "@mui/system",
  "@mui/utils",
  "axios",
  "react",
  "react-dom",
  "react-helmet-async",
  "react-resizable-panels",
  "react-router",
  "react-router-dom",
  "react-toastify",
]

function isExternal(id: string) {
  return externalPackages.some(pkg => id === pkg || id.startsWith(`${pkg}/`))
}

export default defineConfig({
  plugins: [
    reactSwc(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      entryRoot: "src",
      include: ["src"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.stories.{ts,tsx}", "src/test/**"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: format => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: isExternal,
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
