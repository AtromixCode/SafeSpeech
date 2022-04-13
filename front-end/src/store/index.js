import Vue from "vue";
import Vuex from "vuex";
import createWebSocketPlugin from "./websocketStorePlugin";
import createPersistedState from "vuex-persistedstate";
import socket from "../socket";
import key from "./key";
import user from "./user";

Vue.use(Vuex);
const websocketPlugin = createWebSocketPlugin(socket);
export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user: user,
    key: key,
  },
  plugins: [createPersistedState(), websocketPlugin],
});
