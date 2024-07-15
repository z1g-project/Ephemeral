importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
importScripts('/meteor/meteor.config.js');
importScripts('/meteor/meteor.bundle.js');
importScripts('/meteor/meteor.worker.js');
const uv = new UVServiceWorker();
const meteor = new MeteorServiceWorker();

async function handleRequest(event) {
	if (uv.route(event)) {
		return uv.fetch(event);
	}
	if (meteor.shouldRoute(event)) {
		return meteor.handleFetch(event);
	}
	return fetch(event.request);
}

self.addEventListener('fetch', (event) => {
	event.respondWith(handleRequest(event));
});
