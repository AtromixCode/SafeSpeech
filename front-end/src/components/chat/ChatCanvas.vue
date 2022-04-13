<template>
  <b-container>
    <b-row>
      <div class="header">
        <chat-options class="chat-options" style="float: right" />
      </div>
    </b-row>
    <!--    <b-row class="chat-display">-->
    <!--      <li v-for="(msg, idx) in messages" :key="idx" style="color: black">-->
    <!--        {{ msg.content }} - {{ idx }}-->
    <!--      </li>-->
    <!--    </b-row>-->
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
import { mapMutations, mapState } from "vuex";

export default {
  name: "ChatCanvas",
  components: { ChatOptions, MessageList },
  data() {
    return {
      msgInput: "",
      currentChatId: "",
      messages: [],
    };
  },
  computed: {
    ...mapState({ user: (state) => state.user }),
  },
  methods: {
    ...mapMutations("user", ["setUserName", "setUserInfo"]),
    ...mapMutations("keyStore", ["setKeys", "resetState"]),
    sendMessage() {
      console.log("Sending a message " + this.msgInput);
      this.$socket.emit(
        "add message to chat",
        this.msgInput,
        this.$store.state.user.userName,
        this.currentChatId
      );
    },
    addMessageToUI(msg) {
      // TODO add to the UI
      if (msg.username === this.$store.state.user.username) {
        console.log("from ME:" + msg.content);
      } else {
        console.log("from " + msg.username + ": " + msg.content);
      }
    },
    updateUIWithChatMessages() {
      const curChat = this.getChatInfo(this.currentChatId);
      // curChat.messages.forEach(this.addMessageToUI);
      this.messages = curChat.messages;
    },
    getChatInfo(chatId) {
      return this.user.chats.find((chat) => {
        return chat._id === chatId;
      });
    },
    getChatIdx(chatId) {
      return this.user.chats.findIndex((chat) => {
        return chat._id === chatId;
      });
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
      this.currentChatId = chats[0]._id;
      // update ui
      this.updateUIWithChatMessages();
    });
    this.$socket.on("message", (msgPayload, chatId) => {
      console.log("Received message from server");
      // add to store
      const userInfo = this.user;
      let updatedChatIdx = this.getChatIdx(chatId);
      userInfo.chats[updatedChatIdx].messages[
        userInfo.chats[updatedChatIdx].messages.length
      ] = msgPayload;
      this.setUserInfo(userInfo);
      if (chatId === this.currentChatId) {
        // add to UI
        this.messages = userInfo.chats[updatedChatIdx].messages;
        this.addMessageToUI(msgPayload);
      }
    });
    this.$socket.on("get username", () => {
      if (this.$store.state.user.username) {
        this.$socket.emit("logged in", this.$store.state.user.username);
      }
    });
    this.$socket.on("key", async (key) => {
      console.log(key);
      const kkey = await window.crypto.subtle.importKey(
        "jwk",
        key,
        { name: "AES-CTR" },
        true,
        ["encrypt", "decrypt"]
      );
      console.log(kkey);
      // console.log("Setting keys");
      // this.setKeys(keyInfo);
      // console.log(this.$store.state.keyStore.publicKey);
      // console.log(this.$store.state.keyStore.privateKey);
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
