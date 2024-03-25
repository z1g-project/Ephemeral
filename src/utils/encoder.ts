declare global {
	interface Window {
		encoder: {
			encode: (dec: string) => string;
			decode: (enc: string) => string;
		};
	}
}
export default window.encoder;