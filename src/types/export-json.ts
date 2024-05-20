export type EphemeralExport = {
	exportedBy: string;
	version: number;
	date: number;
	cookies: { name: string; value: string }[] | undefined;
	localStorage: { name: string; value: string }[] | undefined;
};
