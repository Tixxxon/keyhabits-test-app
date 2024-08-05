/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_PROTO?: 'http' | 'https';
  readonly API_HOST: string;
  readonly API_PORT: string;
  readonly API_TIMEOUT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}