import { renderToStaticMarkup } from "react-dom/server";
export const openCloaked = () => {
	const newWindow = window.open("about:blank");
	if (!newWindow) return;
	const { href } = document.getElementById(
		"documentfavicon",
	) as HTMLLinkElement;
	const code = (
		<iframe
			src={window.location.origin}
			style={{
				width: "100%",
				height: "100%",
				border: "none",
				overflow: "hidden",
				margin: "0px",
				padding: "0px",
				position: "fixed",
				inset: "0px",
			}}
		></iframe>
	);
	newWindow.document.body.innerHTML = renderToStaticMarkup(code);
	newWindow.document.head.appendChild(
		Object.assign(document.createElement("link"), {
			rel: "icon",
			href,
		}),
	);
	newWindow.document.head.appendChild(
		Object.assign(document.createElement("title"), {
			textContent: document.title,
		}),
	);
	window.location.replace("https://google.com");
};
