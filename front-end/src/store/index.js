import Vue from "vue";
import Vuex from "vuex";
import createWebSocketPlugin from "./websocketStorePlugin";
import socket from "../socket";
import user from "./user";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
const websocketPlugin = createWebSocketPlugin(socket);
export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user: user,
  },
  plugins: [createPersistedState(), websocketPlugin],
});
