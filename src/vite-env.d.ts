/// <reference types="vite/client" />

// process.env.* values are injected at build time via vite.config.ts `define`
declare const process: { env: Record<string, string | undefined> };
