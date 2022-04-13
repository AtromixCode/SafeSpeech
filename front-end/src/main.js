import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import socket from "./socket";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;
Vue.prototype.$socket = socket;
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

export const bus = new Vue();

new Vue({
  router,
  store,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
