export default {
  namespaced: true,
  state: () => ({
    keyName: "",
    key: {},
  }),
  mutations: {
    setKeyName(state, keyName) {
      state.keyName = keyName;
    },

    setKey(state, key) {
      state.key = key;
    },

    resetKey(state) {
      state = {
        keyName: "",
        key: {},
      };
      return state;
    },
  },
};
