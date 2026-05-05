/// <reference types="vite/client" />

declare module "*.css";

interface ImportMetaEnv {
  readonly RUN_API_MODE_SMOKE_TESTS?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_FINANCIAL_DATA_SOURCE?: string;
}
