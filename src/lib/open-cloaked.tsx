import type { Config } from '@/hooks';
import { renderToStaticMarkup } from 'react-dom/server';
export const openCloaked = (config: Config['cloak']) => {
	const newWindow = window.open('about:blank');
	if (!newWindow) return;
	newWindow.document.body.innerHTML = renderToStaticMarkup(
		<iframe
			src={window.location.origin}
			style={{
				width: '100%',
				height: '100%',
				border: 'none',
				overflow: 'hidden',
				margin: '0px',
				padding: '0px',
				position: 'fixed',
				inset: '0px',
			}}
			title={config.title}
		/>,
	);
	newWindow.document.head.appendChild(
		Object.assign(document.createElement('link'), {
			rel: 'icon',
			href: config.favicon,
		}),
	);
	newWindow.document.head.appendChild(
		Object.assign(document.createElement('title'), {
			textContent: config.title,
		}),
	);
	window.location.replace('https://google.com');
};
