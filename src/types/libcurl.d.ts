declare module "libcurl.js/bundled" {
	export type websocketUrl = `wss://${string}` | `ws://${string}`;
	export const libcurl: {
		set_websocket: (url: websocketUrl) => void;
		fetch: (...args) => Promise<Response>;
		ready: boolean;
		version: {
			lib: string;
		};
		onload: (callback: () => void) => void;
	};
}
