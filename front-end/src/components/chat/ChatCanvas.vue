<template>
  <b-container v-if="selectedChat()" class="chat-canvas-container">
    <b-row>
      <div class="header">
        <chat-options class="chat-options" style="float: right" />
      </div>
    </b-row>
    <b-row class="chat-container"><message-list class="chat-display" /></b-row>
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

  <div
    v-else
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    "
  >
    <div style="margin: auto; color: black">Select a chat bro</div>
    <b-row class="chat-container"><message-list class="chat-display" /></b-row>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import ChatOptions from "./ChatOptions.vue";
import MessageList from "./MessageList.vue";
import { mapMutations, mapState } from "vuex";

export default {
  name: "ChatCanvas",
  components: { ChatOptions, MessageList },
  data() {
    return {
      msgInput: "",
      currentChatId: "",
    };
  },
  computed: {
    ...mapState({ user: (state) => state.user }),
  },
  methods: {
    ...mapMutations("user", ["setUserName", "setUserInfo", "recieveMessage"]),
    sendMessage() {
      if (this.msgInput != "") {
        console.log("Sending a message " + this.msgInput);
        this.$socket.emit(
          "add message to chat",
          this.msgInput,
          this.$store.state.user.username,
          this.currentChatId
        );
        this.msgInput = "";
      }
    },
    selectedChat() {
      return this.currentChatId != "";
    },
  },
  created() {
    // TODO un hardcode a username in store
    this.setUserName("bob");
    // retrieve chats
    this.$socket.emit("get chats", this.$store.state.user.username);
  },
  mounted() {
    this.$socket.on("user chats", (chats) => {
      let payload = {
        username: this.$store.state.user.username,
        chats: chats,
      };
      this.setUserInfo(payload);
    });
    this.$socket.on("message", (msgPayload, chatId) => {
      console.log("Received message from server");
      this.recieveMessage({ msgPayload, chatId });
      this.$forceUpdate();
    });
    this.$socket.on("get username", () => {
      if (this.$store.state.user.username) {
        this.$socket.emit("logged in", this.$store.state.user.username);
      }
    });

    bus.$on("chat-click-canvas", (chatId) => {
      console.log("in canvas list");
      if (this.currentChatId != chatId) {
        this.currentChatId = chatId;
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

@media screen and (max-width: 1000px) {
  .chat-options {
    visibility: hidden !important;
  }
  .header {
    height: 0 !important;
  }
  .chat-container {
    height: 90% !important;
  }
}

.chat-options {
  visibility: visible;
  color: #0d1b2a;
}
.chat-canvas-container .row {
  margin: 0 !important;
  padding: 0 !important;
}

.chat-display {
  margin: auto !important;
  width: 97% !important;
}

.chat-container {
  height: 89%;
  padding-bottom: 1vh !important;
}
</style>
