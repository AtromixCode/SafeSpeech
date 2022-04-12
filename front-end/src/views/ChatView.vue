<template>
  <div class="chat-view">
    <div class="side-bar"><side-bar /></div>
    <div class="chat-canvas"><chat-canvas /></div>
  </div>
</template>

<script>
import SideBar from "@/components/chat/SideBar.vue";
import ChatCanvas from "../components/chat/ChatCanvas.vue";
export default {
  components: { SideBar, ChatCanvas },
  name: "ChatView",
  beforeCreate() {
    let testUserInfo = {
      userName: "Test Username",
    };
    this.$store.commit("user/setUserInfo", testUserInfo);
    console.log(this.$store.state.user);
  },
};
</script>

<style scoped>
.side-bar {
  width: 25%;
  height: 100%;
  box-shadow: 5px 0px 25px 5px rgb(123, 123, 123);
  -webkit-box-shadow: 5px 0px 25px 5px rgb(123, 123, 123);
}
.chat-canvas {
  width: 75%;
  height: 100%;
}

@media screen and (max-width: 1150px) {
  .side-bar {
    width: 100%;
    height: 7%;
  }
  .chat-canvas {
    width: 100%;
    height: 93%;
  }
}

.chat-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
