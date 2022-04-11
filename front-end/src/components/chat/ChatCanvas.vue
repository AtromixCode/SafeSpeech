<template>
  <div><chat-options /></div>
</template>

<script>
import ChatOptions from "./ChatOptions.vue";
export default {
  components: { ChatOptions },
  name: "ChatCanvas",
};
</script>

<style>
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
</style>
