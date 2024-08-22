type BareHeaders = Record<string, string>;
const LibcurlClient: new (args: { wisp: string }) => {
	request: (
		remote: URL,
		method: string,
		body: BodyInit | null,
		headers: BareHeaders,
		signal: AbortSignal | null | undefined,
	) => Promise<{
		body: ReadableStream | ArrayBuffer | Blob | string;
		headers: BareHeaders;
		status: number;
		statusText: string;
	}>;
	init: () => Promise<void>;
} = (
	await import(
		/* @vite-ignore */ `${window.location.toString()}libcurl/index.mjs`
	)
).default;
function getFetch(
	client: InstanceType<typeof LibcurlClient>,
): (remote: URL | string, init?: RequestInit) => Promise<Response> {
	return async function fetch(
		remote: URL | string,
		init?: RequestInit,
	): Promise<Response> {
		if (typeof remote === 'string') {
			// biome-ignore lint:
			remote = new URL(remote);
		}
		const {
			method = 'GET',
			body = null,
			headers = {},
			signal = undefined,
		} = init || {};
		const response = await client.request(
			remote,
			method,
			body,
			headers as BareHeaders,
			signal,
		);
		return new Response(response.body, {
			headers: new Headers(response.headers),
			status: response.status,
			statusText: response.statusText,
		});
	};
}
declare global {
	interface Window {
		libcurl: InstanceType<typeof LibcurlClient>;
	}
}
if (!window.libcurl) {
	window.libcurl = new LibcurlClient({
		wisp: localStorage.getItem('proxy.wispServer') as string,
	});
	await window.libcurl.init();
}

export { LibcurlClient, getFetch };
