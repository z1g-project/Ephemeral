export const injectPlugins = (iframeId: string): void => {
	const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
	if (!iframe) {
		console.error(`Iframe: ${iframeId} not found.`);
		return;
	}
	const checkInjected = () => {
		const plugins = localStorage.getItem("addons");
		if (plugins) {
			const pluginArray = JSON.parse(plugins) as string[];
			pluginArray.forEach((pluginUrl) => {
				const scripts = iframe.contentDocument?.querySelectorAll("script");
				const isInjected = Array.from(scripts || []).some(
					(script) => script.src === pluginUrl,
				);
				if (!isInjected) {
					const script = document.createElement("script");
					script.src = pluginUrl;
					iframe.contentDocument?.body.appendChild(script);
					console.log(
						`\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Plugin ${pluginUrl} injected!`,
					);
				}
			});
		}
	};

	checkInjected();
	iframe.addEventListener("load", checkInjected);
};
