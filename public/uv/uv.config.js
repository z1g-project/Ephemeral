const factory = (key) => {
	const getShuffledAlphabet = () => {
		const alphabet =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
		return shuffle(alphabet, key);
	};

	const shuffle = (alphabet, key) => {
		const shuffledAlphabet = [...alphabet];

		for (let i = 0; i < key.length; i++) {
			const charCode = key.charCodeAt(i) % alphabet.length;
			const shiftAmount = charCode < 0 ? charCode + alphabet.length : charCode;

			for (let j = 0; j < alphabet.length; j++) {
				const newIndex = (j + shiftAmount) % alphabet.length;
				const temp = shuffledAlphabet[j];
				shuffledAlphabet[j] = shuffledAlphabet[newIndex];
				shuffledAlphabet[newIndex] = temp;
			}
		}

		return shuffledAlphabet.join("");
	};

	const base64Encode = (text) => {
		const shuffledAlphabet = getShuffledAlphabet();
		const alphabet =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		return [...btoa(text)]
			.map((char) => {
				const index = alphabet.indexOf(char);
				return index !== -1 ? shuffledAlphabet[index] : char;
			})
			.join("");
	};

	const base64Decode = (encodedText) => {
		const shuffledAlphabet = getShuffledAlphabet();
		const alphabet =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		return atob(
			[...encodedText]
				.map((char) => {
					const index = shuffledAlphabet.indexOf(char);
					return index !== -1 ? alphabet[index] : char;
				})
				.join(""),
		);
	};

	return {
		enc: base64Encode,
		dec: function (encodedText) {
			if (encodedText.includes("?")) {
				encodedText = base64Encode(
					base64Decode(encodedText.split("?")[0]) +
						"?" +
						encodedText.split("?")[1],
				);
				console.log(1);
			}
			return base64Decode(encodedText);
		},
	};
};

const key = (location.origin + navigator.userAgent).toUpperCase();
const cipher = factory(key);

self.__uv$config = {
	prefix: "/~/dark/",
	bare: "/bend/",
	encodeUrl: cipher.enc,
	decodeUrl: cipher.dec,
	handler: "/uv/uv.handler.js",
	client: "/uv/uv.client.js",
	bundle: "/uv/uv.bundle.js",
	config: "/uv/uv.config.js",
	sw: "/uv/uv.sw.js",
	proxyIp: "",
	proxyPort: "",
};

self.encoder = {
	encode: cipher.enc,
	decode: cipher.dec,
};
