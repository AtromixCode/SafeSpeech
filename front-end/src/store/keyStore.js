export default {
  namespaced: true,
  state: () => ({
    keys: [{ keyName: "", key: {} }],
  }),
  mutations: {
    addKey(state, keyInfo) {
      console.log(state.keys);
      state.keys.push(keyInfo);
      console.log(state.keys);
    },
    resetState(state) {
      state = {
        keys: new Map(),
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
