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
    ...mapMutations("key", ["setKey", "resetState"]),
    async sendMessage() {
      console.log("Sending a message " + this.msgInput);
      let encryptionResult = await this.encrypt(this.msgInput);
      console.log(encryptionResult);
      this.$socket.emit(
        "add message to chat",
        encryptionResult.encryptedString,
        this.$store.state.user.userName,
        this.currentChatId,
        encryptionResult.counter
      );
    },
    async encrypt(string) {
      console.log("Encrypting");
      console.log(string);
      let enc = new TextEncoder();
      let encoded = enc.encode(string);
      let counter = window.crypto.getRandomValues(new Uint8Array(16));
      let encryptedString = await window.crypto.subtle.encrypt(
        {
          name: "AES-CTR",
          counter,
          length: 128,
        },
        this.$store.state.key.key,
        encoded
      );
      console.log(encryptedString);
      return { counter: counter, encryptedString: encryptedString };
    },
    async decrypt(encryptedString, counter) {
      console.log("Decrypting");
      return await window.crypto.subtle.decrypt(
        {
          name: "AES-CTR",
          counter,
          length: 128,
        },
        this.$store.state.key.key,
        encryptedString
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
    this.$socket.on("user chats", async (chats) => {
      console.log(chats);
      // decrypt all messages in the chats
      for (let i in chats) {
        for (let j in chats[i].messages) {
          if (chats[i].messages[j].counter) {
            const decoder = new TextDecoder();
            console.log(chats[i].messages[j]);
            let bytestream = await this.decrypt(
              chats[i].messages[j].content,
              chats[i].messages[j].counter
            );
            chats[i].messages[j].content = decoder.decode(bytestream);
            console.log("Decrypted: " + chats[i].messages[j].content);
          }
        }
      }

      let payload = {
        username: this.$store.state.user.username,
        chats: chats,
      };
      this.setUserInfo(payload);
      this.currentChatId = chats[0]._id;
      // update ui
      this.updateUIWithChatMessages();
    });
    this.$socket.on("message", async (msgPayload, chatId) => {
      console.log("Received message from server");
      console.log(msgPayload);
      // decrypt if necessary
      if (msgPayload.counter) {
        const decoder = new TextDecoder();
        let bytestream = await this.decrypt(
          msgPayload.content,
          msgPayload.counter
        );
        msgPayload.content = decoder.decode(bytestream);
      }
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
      const kkey = await window.crypto.subtle.importKey(
        "jwk",
        key,
        { name: "AES-CTR" },
        true,
        ["encrypt", "decrypt"]
      );
      this.setKey(kkey);
      console.log("Received Key from server");
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
