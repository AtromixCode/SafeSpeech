<template>
  <div><b-button @click="sendMessage">Send something</b-button></div>
</template>

<script>
export default {
  name: "LoginView",
  methods: {
    sendMessage() {
      this.$socket.emit("message", "A message");
    },
  },
};
</script>

<style></style>
