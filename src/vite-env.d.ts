/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_STORAGE_KEY: string;
  /** Comma-separated playlist keys to leave out, e.g. "B,E". */
  readonly VITE_EXCLUDE_PLAYLISTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
