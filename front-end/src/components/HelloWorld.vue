<template>
  <div><b-button @click="sendMessage">Something</b-button></div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    sendMessage() {
      this.$socket.emit("message", "A message");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
