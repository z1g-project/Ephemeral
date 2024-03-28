import { APIData, APIError, APIResponse } from "@/types/api";
import { MD5 } from "crypto-js";
import localforage from "localforage";

const _fetch = globalThis.fetch;
async function fetch<T>(
	url: string,
	{ backend = true, bare = false }: { backend?: boolean; bare?: boolean } = {},
): Promise<T> {
	if (backend && !bare) {
		const response: APIResponse<T> = await _fetch(url).then((response) =>
			response.json(),
		);
		if (response.status == "error") {
			throw { error: true, ...response.error } as APIError;
		}
		return response.data as APIData<T>;
	}
	if (bare) {
		const endpoint = `${(await localforage.getItem("proxy.bareServer")) as string}v3/`;
		return _fetch(`${endpoint}?cache=${MD5(url)}`, {
			headers: {
				"X-Bare-Url": url,
				"X-Bare-Headers": "{}",
			},
		}) as Promise<T>;
	}
	return _fetch(url) as Promise<T>;
}
export { fetch };
