<template>
  <b-dropdown
    size="lg"
    variant="link"
    toggle-class="text-decoration-none"
    no-caret
    right
    class="dropdown-btn"
  >
    <template #button-content> <b-icon icon="three-dots" /></template>
    <b-dropdown-item-button class="menu-button">
      <span class="menu-button-text" v-on:click="leaveChat">
        Leave Chat
      </span></b-dropdown-item-button
    >
  </b-dropdown>
</template>

<script>
import { bus } from "@/main.js";
export default {
  name: "ChatOptions",
  methods: {
    leaveChat() {
      bus.$emit("leave chat");
    },
  },
};
</script>

<style>
.menu-button {
  background-color: #0d1b2a;
  text-align: center;
}

.menu-button-text {
  color: white;
}

.dropdown-menu {
  background-color: #0d1b2a !important;
}

.dropdown-toggle {
  border: 0;
  color: inherit !important;
}
</style>
