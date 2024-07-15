// uv's being lame so i can't get it from cipher.js
/** @type {import('meteorproxy').Config} */
const config = {
	prefix: '/~/light/',
	codec: {
		encode: cipher.enc,
		decode: cipher.dec,
	},
	debug: false,
	plugins: [
		{
			name: 'exampleplugin',
			filter: /https:\/\/example.com*/g,
			inject(ctx) {
				ctx.injectHead(`<meta name="meteor" content="meteor - epic proccy">`);
			},
			async onRequest(request) {
				request.headers.set('X-Proxy', 'Meteor');
				return request;
			},
			handleClient(window) {
				window.console.log('Meteor is running on the client!');
				const ws = new WebSocket('wss://echo.websocket.org/');
				ws.addEventListener('message', (e) => {
					console.log(e.data);
				});
			},
		},
	],

	files: {
		client: '/meteor/meteor.client.js',
		worker: '/meteor/meteor.worker.js',
		bundle: '/meteor/meteor.bundle.js',
		config: '/meteor/meteor.config.js',
		codecs: '/cipher.js',
	},
};

self.__meteor$config = config;
