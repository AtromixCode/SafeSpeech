export default {
  namespaced: true,
  state: () => ({
    keys: new Map(),
  }),
  mutations: {
    addKey(state, keyInfo) {
      state.keys.set(keyInfo.keyName, keyInfo.key);
    },
  },
};
