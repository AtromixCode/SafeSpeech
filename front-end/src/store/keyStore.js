export default {
  namespaced: true,
  state: () => ({
    publicKey: "",
    privateKey: "",
  }),
  mutations: {
    setKeys(state, keyInfo) {
      state.privateKey = keyInfo.privateKey;
      state.publicKey = keyInfo.publicKey;
    },
    resetState(state) {
      state = {
        publicKey: "",
        privateKey: "",
      };
      return state;
    },
  },
  actions: {
    getKey: (state) => (keyName) => {
      return state.keys.get(keyName);
    },
  },
};
