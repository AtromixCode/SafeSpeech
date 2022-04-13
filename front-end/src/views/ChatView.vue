<template>
  <div class="chat-view">
    <div class="side-bar"><side-bar /></div>
    <div class="chat-canvas"><chat-canvas /></div>
  </div>
</template>

<script>
import SideBar from "@/components/chat/SideBar.vue";
import ChatCanvas from "../components/chat/ChatCanvas.vue";
import { mapState, mapMutations } from "vuex";

export default {
  components: { SideBar, ChatCanvas },
  name: "ChatView",

  computed: { ...mapState({ user: (state) => state.user }) },
  methods: { ...mapMutations("user", ["setUserName", "setUserInfo", "resetUserInfo"]) },
  created() {},

  mounted() {},
};
</script>

<style scoped>
.side-bar {
  width: 25%;
  height: 100%;
  box-shadow: 5px 0px 25px 5px rgb(123, 123, 123);
  -webkit-box-shadow: 5px 0px 25px 5px rgb(123, 123, 123);
  position: absolute;
  z-index: 10000;
}
.chat-canvas {
  width: 75%;
  height: 100%;
  margin-left: 25%;
}

@media screen and (max-width: 1000px) {
  .side-bar {
    width: 100%;
    height: 6%;
  }
  .chat-canvas {
    width: 100%;
    height: 94%;
    margin-left: 0;
  }
}

.chat-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
