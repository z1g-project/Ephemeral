import list from "./apps.json";

export type Application = {
  name: string;
  desc: string;
  path: string;
};

export const apps = list as Application[];
