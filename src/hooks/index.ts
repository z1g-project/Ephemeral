import localforage from "localforage";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetch } from "@/utils/fetch";

interface Options {
	useCurrentData?: boolean;
}

type AsyncState<T> = {
	data: T | null;
	error: Error | null;
	loading: boolean;
};

const DEFAULT_OPTIONS: Options = {
	useCurrentData: false,
};

function useAsync<T>(
	initialData: T | null,
	options: Options = DEFAULT_OPTIONS,
) {
	const [state, setState] = useState<AsyncState<T>>({
		data: initialData,
		error: null,
		loading: false,
	});
	const latestData = useRef<T | null>(initialData);

	const run = useCallback(async (promiseFn: () => Promise<T>) => {
		setState((prevState) => ({ ...prevState, loading: true }));
		try {
			const data = await promiseFn();
			latestData.current = data;
			setState({ data, error: null, loading: false });
			return data;
		} catch (error) {
			setState(
				(prevState) =>
					({
						...prevState,
						error,
						loading: false,
						data: null,
					}) as AsyncState<T>,
			);
			console.error(error); // Handle or log the error appropriately
			return null;
		}
	}, []);

	useEffect(() => {
		if (options.useCurrentData && latestData.current !== null) {
			setState((prevState) => ({ ...prevState, data: latestData.current }));
		}
	}, [options.useCurrentData]);

	return {
		...state,
		run,
	};
}

type ProxyConfig = {
	bareServer: string;
	proxyServer: string;
};

type CloakConfig = {
	preset: string;
	title: string;
	favicon: string;
};

type SearchConfig = {
	url: string;
	engine: string;
};

type Config = {
	proxy: ProxyConfig;
	cloak: CloakConfig;
	search: SearchConfig;
};

const defaultConfig: Config = {
	proxy: {
		bareServer: "/bend/",
		proxyServer: "",
	},
	cloak: {
		preset: "Google",
		title: "Google",
		favicon: "https://www.google.com/favicon.ico",
	},
	search: {
		url: "https://google.com/search?q=",
		engine: "Google",
	},
};

type AllConfig = ProxyConfig & CloakConfig & SearchConfig;
type Path = keyof Config;
type SubPath = keyof Config[Path];

function useConfig(): [Config, () => void, boolean];
function useConfig<Path extends keyof Config>(
	path: Path,
): [Config[Path], () => void, boolean];
function useConfig(
	path?: Path,
): [Config, () => void, boolean] | [Config[Path], () => void, boolean] {
	const [configState, setConfigState] = useState<Config>({ ...defaultConfig });
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const initConfig = async () => {
			try {
				for (const key in defaultConfig) {
					const subConfig: Record<string, string> = {};
					const subKeys = Object.keys(defaultConfig[key as Path]);
					for (const subKey of subKeys) {
						const value = await localforage.getItem(`${key}.${subKey}`);
						if (!value) {
							await localforage.setItem(
								`${key}.${subKey}`,
								defaultConfig[key as Path][subKey as SubPath],
							);
						}
						subConfig[subKey] = (value ||
							defaultConfig[key as Path][subKey as SubPath]) as string;
					}
					setConfigState((prevState) => ({
						...prevState,
						[key]: subConfig,
					}));
				}
				console.log(
					"\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Default config loaded.",
				);
			} catch (error) {
				console.error(error); // Handle or log the error appropriately
			}
			setLoading(false);
		};

		initConfig();
	}, []);

	const configProxyHandler: ProxyHandler<Record<string, string>> = {
		set: function (_, property: string, value: never) {
			if (path) {
				setConfigState((prevState) => ({
					...prevState,
					[path]: {
						...prevState[path],
						[property]: value,
					},
				}));
				localforage.setItem(`${path}.${property}`, value);
			} else {
				throw new TypeError("Config is read only when no path is specified.");
			}
			return true;
		},
	};

	const proxiedConfig: Config = Object.keys(defaultConfig).reduce(
		(acc, key) => {
			acc[key as Path] = new Proxy(
				configState[key as Path],
				configProxyHandler,
			) as AllConfig;
			return acc;
		},
		{} as Config,
	);

	const reset = useCallback(() => {
		if (path) {
			for (const key in defaultConfig[path as Path]) {
				localforage.setItem(
					`${path}.${key}`,
					defaultConfig[path][key as SubPath],
				);
				setConfigState((prevState) => ({
					...prevState,
					[path]: {
						...prevState[path],
						[key]: defaultConfig[path][key as SubPath],
					},
				}));
			}
		} else {
			for (const key in defaultConfig) {
				for (const subKey in defaultConfig[key as Path]) {
					localforage.setItem(
						`${key}.${subKey}`,
						defaultConfig[key as Path][subKey as SubPath],
					);
					setConfigState((prevState) => ({
						...prevState,
						[key]: {
							...prevState[key as Path],
							[subKey]: defaultConfig[key as Path][subKey as SubPath],
						},
					}));
				}
			}
		}
	}, [path]);

	if (path) {
		return [proxiedConfig[path as Path], reset, loading];
	} else {
		return [proxiedConfig, reset, loading];
	}
}

const useSuggestions = () => {
	const {
		data: suggestions,
		loading,
		error,
		run,
	} = useAsync<string[]>([], { useCurrentData: true });

	const fetchSuggestions = useCallback(
		async (query: string) => {
			return await run(async () => {
				const parser = new DOMParser();
				const response = parser.parseFromString(
					await fetch<Response>(
						`https://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q=${encodeURIComponent(query)}`,
						{
							bare: true,
						},
					).then((response) => response.text()),
					"text/xml",
				);
				return [...response.childNodes[0].childNodes]
					.map(
						(element) =>
							(element.childNodes[0] as Element).attributes.getNamedItem(
								"data",
							)!.nodeValue!,
					)
					.slice(0, 8);
			});
		},
		[run],
	);

	return {
		suggestions,
		loading,
		error,
		fetchSuggestions,
	};
};

export { useAsync, useConfig, useSuggestions };
