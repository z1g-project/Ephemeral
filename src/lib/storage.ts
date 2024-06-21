import type { DataExport } from "@/types/export-json";
import { openDB } from "idb";

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
export async function getIndexedDB(): Promise<DataExport["cookies"][]> {
  const db = await openDB("__op", 1, {
    upgrade(db) {
      const store = db.createObjectStore("cookies", {
        keyPath: "id",
      });
      store.createIndex("path", "path");
    },
  });
  return db.getAll("cookies");
}
export async function setIndexedDB(data: { [key: string]: unknown }) {
  if (data.expires) {
    data.expires = new Date(data.expires as string);
  }
  if (data.set) {
    data.set = new Date(data.set as string);
  }
  const db = await openDB("__op", 1, {
    upgrade(db) {
      const store = db.createObjectStore("cookies", {
        keyPath: "id",
      });
      store.createIndex("path", "path");
    },
  });
  return db.put("cookies", data);
}
