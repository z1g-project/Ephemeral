// @ts-check
/** @type {import('meteorproxy').Config} */
const config = {
	prefix: '/~/light/',
	codec: self.$meteor_codecs.locationvariable,
	debug: false,
	plugins: [
		{
			name: 'Vencord',
			filter: /discord.com*/g,
			inject(ctx) {
				ctx.injectHTML(
					'<script src="https://raw.githubusercontent.com/Vencord/builds/main/browser.js"></script><link rel="stylesheet" href="https://raw.githubusercontent.com/Vencord/builds/main/browser.css">',
				);
			},
		},
	],

	files: {
		client: '/meteor/meteor.client.js',
		worker: '/meteor/meteor.worker.js',
		bundle: '/meteor/meteor.bundle.js',
		codecs: '/meteor/meteor.codecs.js',
		config: '/meteor/meteor.config.js',
	},
};

self.$meteor_config = config;
