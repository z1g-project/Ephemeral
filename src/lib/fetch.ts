import type { APIData, APIError, APIResponse } from '@/types/api';
import { getFetch } from './libcurl';

const _fetch = globalThis.fetch;
const libcurlFetch = getFetch(window.libcurl);
async function fetch<T>(
	url: string,
	{ backend = true, wisp = false }: { backend?: boolean; wisp?: boolean } = {},
): Promise<T> {
	if (backend) {
		if (!wisp) {
			const response: APIResponse<T> = await _fetch(url).then((response) =>
				response.json(),
			);
			if (response.status === 'error') {
				throw { error: true, ...response.error } as APIError;
			}
			return response.data as APIData<T>;
		}

		const response: APIResponse<T> = await libcurlFetch(url).then((response) =>
			response.json(),
		);
		if (response.status === 'error') {
			throw { error: true, ...response.error } as APIError;
		}
		return response.data as APIData<T>;
	}

	if (wisp) {
		return libcurlFetch(url) as Promise<T>;
	}
	return _fetch(url) as Promise<T>;
}
export { fetch };
