import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "@/views/LoginView.vue";
import ChatView from "@/views/ChatView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/chat",
    name: "chat",
    component: ChatView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
