export default {
  namespaced: true,
  state: () => ({
    key: {},
  }),
  mutations: {
    setKey(state, key) {
      state.key = key;
    },
    resetState(state) {
      state.key = {};
    },
  },
};
