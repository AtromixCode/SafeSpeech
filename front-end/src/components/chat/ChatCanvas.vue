<template>
  <b-container>
    <b-row
      ><div class="header">
        <chat-options class="chat-options" style="float: right" /></div
    ></b-row>
    <b-row class="chat-display"><message-list /></b-row>
    <b-row>
      <div class="chat-input-div">
        <b-input-group class="chat-input">
          <b-form-input
            placeholder="Enter a message 😎"
            class="input-text"
            v-model="msgInput"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              @click="sendMessage"
              pill
              variant="dark"
              class="mx-2 px-4 send-button"
            >
              <b-icon icon="cursor" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import { bus } from "@/main.js";
import ChatOptions from "./ChatOptions.vue";
import MessageList from "./MessageList.vue";
export default {
  components: { ChatOptions, MessageList },
  name: "ChatCanvas",

  data() {
    return {
      msgInput: "",
      currentChat: "",
    };
  },
  methods: {
    sendMessage() {
      let payload = {
        content: this.msgInput,
        chatId: this.currentChat,
        username: this.$store.state.user.userName,
      };
      this.$socket.emit("add message to chat", payload);
      this.msgInput = "";
    },
  },
  mounted() {
    this.$socket.on("add message to chat", (payload) => {
      // TODO display
      console.log(payload);
    });

    bus.$on("chat-click", (chatId) => {
      if (this.currentChat != chatId) {
        this.currentChat = chatId;
      }
    });
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
ul::-webkit-scrollbar {
  display: none;
}
.header {
  display: block;
  padding: 0;
}

.chat-input {
  margin: auto !important;
  width: 97% !important;
}

.form-control {
  border-radius: 30px !important;
  box-shadow: 0px 5px 5px 0px rgb(180, 180, 180) !important;
  background-color: #f4fbff !important;
}

.container {
  margin: auto !important;
  height: 100% !important;
}

.chat-display {
  margin: auto !important;
  height: 85% !important;
}

@media screen and (max-width: 1000px) {
  .chat-options {
    visibility: hidden !important;
  }
}

.chat-options {
  visibility: visible;
  color: #0d1b2a;
}
</style>
