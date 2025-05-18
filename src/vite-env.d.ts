/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OZOW_ENABLED: string;
  readonly VITE_OZOW_NAME: string;
  readonly VITE_OZOW_MERCHANT_CODE: string;
  readonly VITE_OZOW_DEFAULT_BANK_ACCOUNT: string;
  readonly VITE_OZOW_TIME_ZONE: string;
  readonly VITE_OZOW_PRIVATE_KEY: string;
  readonly VITE_OZOW_API_KEY: string;
  readonly VITE_OZOW_PAYOUTS_API_KEY: string;
  readonly VITE_OZOW_COMPANY_REG_NUMBER: string;
  // add more as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
