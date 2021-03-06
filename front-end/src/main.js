import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import socket from "./socket";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
export const bus = new Vue();

Vue.config.productionTip = false;
Vue.prototype.$socket = socket;
Vue.prototype.$screen = Vue.observable({
  width: window.innerWidth,
  height: window.innerHeight,
});

window.addEventListener("resize", () => {
  Vue.prototype.$screen.width = window.innerWidth;
  Vue.prototype.$screen.height = window.innerHeight;
});
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

new Vue({
  router,
  store,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
