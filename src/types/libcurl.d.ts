declare module "libcurl.js/bundled" {
	const libcurl: {
		set_websocket: (url: string) => void;
		fetch: (...args) => Promise<Response>;
		ready: boolean;
		version: {
			lib: string;
		};
		onload: (callback: () => void) => void;
	};
}
