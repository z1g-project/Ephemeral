/// <reference types="vite/client" />

declare const __BUILD_DATE__: Date;
interface ImportMetaEnv {
	readonly VITE_WISP_SERVER: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
