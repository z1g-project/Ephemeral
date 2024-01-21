localforage.config({
  driver: localforage.INDEXEDDB,
  name: "ephermal",
  storename: "__ephermal_config",
});
const bareServer = {
  addBare: (server: string) => {
    localforage.setItem("__bserver", server);
  },
  getBare: async () => {
    return await localforage.getItem("__bserver");
  },
  addProxy: (server: string) => {
    localforage.setItem("__hproxy", server);
  },
  getProxy: async () => {
    return await localforage.getItem("__hproxy");
  },
};
export { bareServer };
