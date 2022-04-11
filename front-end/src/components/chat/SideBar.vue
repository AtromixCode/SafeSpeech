<template>
  <div class="bar">
    Side bar
    <chat-options />
  </div>
</template>

<script>
import ChatOptions from "./ChatOptions.vue";
export default {
  components: { ChatOptions },
  name: "SideBar",
};
</script>

<style scoped>
.bar {
  background-color: #2a8bf2;
  height: 100%;
}

div {
  color: white;
}
</style>
