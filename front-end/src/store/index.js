import Vue from "vue";
import Vuex from "vuex";
import createWebSocketPlugin from "./websocketStorePlugin";
import socket from "../socket";
import keyStore from "./keyStore";

Vue.use(Vuex);
const websocketPlugin = createWebSocketPlugin(socket);
export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    keyStore: keyStore,
  },
  plugins: [websocketPlugin],
});
