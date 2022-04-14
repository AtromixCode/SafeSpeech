import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "@/views/Login.vue";
import RegisterView from "@/views/Register.vue";
import ChatView from "@/views/ChatView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
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
