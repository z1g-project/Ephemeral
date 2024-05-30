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
        const openRequest = indexedDB.open("__op", 1);
        openRequest.onupgradeneeded = () => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains("cookies")) {
                const st = db.createObjectStore("cookies", { keyPath: "id", autoIncrement: true });
				st.createIndex("path", "path", { unique: false });
            }
        };
        openRequest.onsuccess = () => {
            const db = openRequest.result;
            const trans = db.transaction("cookies", "readwrite");
            const cookies = trans.objectStore("cookies");
            cookies.add(data);
            trans.oncomplete = () => {
                resolve();
            };
            trans.onerror = () => {
                reject();
            };
        };
        openRequest.onerror = () => {
            reject();
        };
    });
}
