declare module "libcurl.js/bundled" {
	export const libcurl: {
		set_websocket: (url: string) => void;
		fetch: (...args) => Promise<Response>;
		ready: boolean;
	};
}
