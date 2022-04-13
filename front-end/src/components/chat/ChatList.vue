<template>
  <div>
    <nav>
      <ul>
        <b-button
          v-b-toggle.sidebar-1
          v-for="chat in buttons"
          v-bind:pressed="chat.highlighted"
          :key="chat.id"
          :id="chat.id"
          @click="onClick(chat.id)"
          squared
          variant="none"
          class="chat-button"
        >
          {{ chat.title }}
        </b-button>
      </ul>
    </nav>
  </div>
</template>

<script>
import { bus } from "@/main.js";
export default {
  name: "ChatList",
  props: ["buttonList"],
  data() {
    return { buttons: this.buttonList };
  },
  mounted() {
    this.buttons[0].highlighted = true;
  },
  methods: {
    onClick(chatId) {
      const isNotClickedButton = (chat) => {
        return chat.id != chatId;
      };
      const isClickedButton = (chat) => {
        return chat.id === chatId;
      };
      this.buttons.filter(isNotClickedButton).forEach((notClickedButton) => {
        notClickedButton.highlighted = false;
      });

      this.buttons.find(isClickedButton).highlighted = true;
      bus.$emit("chat-click", chatId);
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
nav ul {
  height: 85vh;
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  padding: 0;
}

nav ul button {
  height: 75px;
  width: 100%;
  list-style: none;
}

ul::-webkit-scrollbar {
  display: none;
}

.chat-button {
  background-color: #2a8bf2;
  color: inherit;
}

.chat-button:hover,
.chat-button.active {
  background-color: #00bd9d !important;
}
</style>
