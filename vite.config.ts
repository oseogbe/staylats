import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Docker Desktop bind mounts don't forward inotify events from the host,
    // so the watcher has to poll or HMR never fires. Opt-in via env so native
    // `npm run dev` on the host keeps the cheaper event-based watcher.
    watch:
      process.env.VITE_USE_POLLING === "true"
        ? { usePolling: true, interval: 300 }
        : undefined,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
