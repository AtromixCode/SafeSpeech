<template>
  <nav v-if="collapsable()">
    <ul>
      <b-button
        v-b-toggle.sidebar-1
        v-for="chat in user.chats"
        v-bind:pressed="chat._id === currentChat"
        :key="chat._id"
        :id="chat._id"
        @click="onClick(chat._id)"
        squared
        variant="none"
        class="chat-button"
      >
        {{ chat.chatTitle }}
      </b-button>
    </ul>
  </nav>
  <nav v-else>
    <ul>
      <b-button
        v-for="chat in user.chats"
        v-bind:pressed="chat._id === currentChat"
        :key="chat._id"
        :id="chat._id"
        @click="onClick(chat._id)"
        squared
        variant="none"
        class="chat-button"
      >
        {{ chat.chatTitle }}
      </b-button>
    </ul>
  </nav>
</template>

<script>
import { bus } from "@/main.js";
import { mapMutations, mapState } from "vuex";
export default {
  name: "ChatList",
  data() {
    return {
      currentChat: "",
    };
  },

  computed: {
    ...mapState({ user: (state) => state.user }),
  },
  methods: {
    ...mapMutations("user", ["addChat"]),
    onClick(chatId) {
      bus.$emit("chat-click-canvas", chatId);
    },

    collapsable() {
      return this.$screen.width < 1000;
    },
  },

  mounted() {
    this.$socket.on("chat", (data) => {
      console.log(data);
      this.addChat(data);
    });
  },
};
</script>

<style scoped>
nav ul {
  height: 70vh;
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  padding: 0;
}

nav {
  padding: 0 !important;
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
