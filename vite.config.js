import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer"; // analyze bundle

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    visualizer({ open: false }), // see what’s bloating build
  ],
  server: {
    port: 5173,
    open: true, // auto-open browser in dev
  },
  build: {
    target: "esnext",       // modern JS output
    cssCodeSplit: true,     // split CSS by component
    sourcemap: false,       // disable maps in prod (smaller size)
    minify: "terser",       // better minification than esbuild
    chunkSizeWarningLimit: 1000, // silence warnings for big libs
    rollupOptions: {
      output: {
        manualChunks: {
          // split vendor & react into separate cached chunks
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});