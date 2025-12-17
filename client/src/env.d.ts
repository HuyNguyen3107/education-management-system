declare module "*.css";
declare module "*.scss";
declare module "*.png";
declare module "*.jpg";
declare module "*.svg";

declare module "@fontsource/*";

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // add other `VITE_` env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
