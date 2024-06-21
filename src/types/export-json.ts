export type DataExport = {
  exportedBy: string;
  version: number;
  date: number;
  cookies: { [key: string]: unknown }[] | undefined;
  localStorage: { name: string; value: string }[] | undefined;
};
