export function getLocalStorage() {
	const values:
		| {
				name: string;
				value: string | null;
		  }[]
		| null = [];
	const keys = Object.keys(localStorage);
	let i = keys.length;

	while (i--) {
		if (localStorage.getItem(keys[i]))
			values.push({ name: keys[i], value: localStorage.getItem(keys[i]) });
	}

	return values;
}
// eslint-disable-next-line
export function getIndexedDB(): Promise<any[]> {
	return new Promise((resolve, reject) => {
		const openRequest = indexedDB.open("__op");
		openRequest.onsuccess = () => {
			const db = openRequest.result;
			const trans = db.transaction("cookies");
			const cookies = trans.objectStore("cookies");
			const cookiesAll = cookies.getAll();

			cookiesAll.onsuccess = () => {
				resolve(cookiesAll.result);
			};
			cookiesAll.onerror = () => {
				reject();
			};
		};
	});
}
export function setIndexedDB(data: { [key: string]: unknown }) {
	if (data.expires) {
		data.expires = new Date(data.expires as string);
	}
	if (data.set) {
		data.set = new Date(data.set as string);
	}
	return new Promise<void>((resolve, reject) => {
		const openRequest = indexedDB.open("__op");
		openRequest.onsuccess = () => {
			const db = openRequest.result;
			const trans = db.transaction("cookies", "readwrite");
			const cookies = trans.objectStore("cookies");
			cookies.add(data);
			resolve();
		};
		openRequest.onerror = () => {
			reject();
		};
	});
}
