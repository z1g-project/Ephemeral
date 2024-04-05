import { APIData, APIError, APIResponse } from "@/types/api";
import { libcurl } from "libcurl.js/bundled";

const _fetch = globalThis.fetch;
async function fetch<T>(
	url: string,
	{ backend = true, wisp = false }: { backend?: boolean; wisp?: boolean } = {},
): Promise<T> {
	if (backend) {
		if (!wisp) {
			const response: APIResponse<T> = await _fetch(url).then((response) =>
				response.json(),
			);
			if (response.status == "error") {
				throw { error: true, ...response.error } as APIError;
			}
			return response.data as APIData<T>;
		} else {
			const response: APIResponse<T> = await libcurl
				.fetch(url)
				.then((response: Response) => response.json());
			if (response.status == "error") {
				throw { error: true, ...response.error } as APIError;
			}
			return response.data as APIData<T>;
		}
	}

	if (wisp) {
		return libcurl.fetch(url) as Promise<T>;
	}
	return _fetch(url) as Promise<T>;
}
export { fetch };
