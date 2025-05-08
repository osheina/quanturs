import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify('https://pciobrhrmhpqmthixvcb.supabase.co'),
    'process.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjaW9icmhybWhwcW10aGl4dmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzODEzMjUsImV4cCI6MjA2MDk1NzMyNX0.q6-zzSPrd0BDJ7SG2O17m6zwsj6iDJ09bJBet-up0aA'),
  },
}));
