<template>
  <div class="chat-canvas">
    <div class="side-bar"><side-bar /></div>
  </div>
</template>

<script>
import SideBar from "@/components/chat/SideBar.vue";
export default {
  components: { SideBar },
  name: "ChatView",
};
</script>

<style scoped>
.side-bar {
  width: 400px;
  height: 100%;
  box-shadow: 5px 0px 25px 10px rgb(123, 123, 123);
  -webkit-box-shadow: 5px 0px 25px 10px rgb(123, 123, 123);
}

@media screen and (max-width: 1100px) {
  .side-bar {
    width: 100%;
    height: 7%;
  }
}

.chat-canvas {
  width: 100%;
  height: 100%;
}
</style>
