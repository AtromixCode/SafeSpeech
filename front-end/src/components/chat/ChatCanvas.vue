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
    // following functions from webcryptoapi docs
    str2ab(str) {
      const buf = new ArrayBuffer(str.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    },
    async importPublicKey(publicKey) {
      console.log(publicKey);
      const testPubKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy3Xo3U13dc+xojwQYWoJLCbOQ5fOVY8LlnqcJm1W1BFtxIhOAJWohiHuIRMctv7dzx47TLlmARSKvTRjd0dF92jx/xY20Lz+DXp8YL5yUWAFgA3XkO3LSJgEOex10NB8jfkmgSb7QIudTVvbbUDfd5fwIBmCtaCwWx7NyeWWDb7A9cFxj7EjRdrDaK3ux/ToMLHFXVLqSL341TkCf4ZQoz96RFPUGPPLOfvN0x66CM1PQCkdhzjE6U5XGE964ZkkYUPPsy6Dcie4obhW4vDjgUmLzv0z7UD010RLIneUgDE2FqBfY/C+uWigNPBPkkQ+Bv/UigS6dHqTCVeD5wgyBQIDAQAB
-----END PUBLIC KEY-----`;
      publicKey = testPubKey;
      // fetch the part of the PEM string between header and footer
      const pemHeader = "-----BEGIN PUBLIC KEY-----";
      const pemFooter = "-----END PUBLIC KEY-----";
      const pemContents = publicKey.substring(
        pemHeader.length,
        publicKey.length - pemFooter.length
      );
      // base64 decode the string to get the binary data
      const binaryDerString = window.atob(pemContents);
      console.log(binaryDerString);
      // convert from a binary string to an ArrayBuffer
      const buf = new ArrayBuffer(binaryDerString.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0, strLen = binaryDerString.length; i < strLen; i++) {
        bufView[i] = binaryDerString.charCodeAt(i);
      }
      return await window.crypto.subtle.importKey(
        "spki",
        buf,
        {
          name: "RSA-PSS",
          hash: "SHA-256",
        },
        true,
        ["encrypt"]
      );
    },
    async importPrivateKey(privateKey) {
      console.log(privateKey);
      // const pemHeader = "-----BEGIN PRIVATE KEY-----";
      // const pemFooter = "-----END PRIVATE KEY-----";
      // const pemContents = privateKey.substring(
      //   pemHeader.length,
      //   privateKey.length - pemFooter.length
      // );
      // console.log(pemContents);
      // base64 decode the string to get the binary data
      // const binaryDerString = window.atob(pemContents);
      // convert from a binary string to an ArrayBuffer
      // const binaryDer = this.str2ab(binaryDerString);
      //
      // return await window.crypto.subtle.importKey(
      //   "pkcs8",
      //   binaryDer,
      //   {
      //     name: "RSA-PSS",
      //     hash: "SHA-256",
      //   },
      //   true,
      //   ["decrypt"]
      // );
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
    this.$socket.on("keys", (publicKey, privateKey) => {
      let keyInfo = {
        publicKey: this.importPublicKey(publicKey),
        privateKey: this.importPrivateKey(privateKey),
      };
      console.log("Setting keys");
      this.setKeys(keyInfo);
      console.log(this.$store.state.keyStore.publicKey);
      console.log(this.$store.state.keyStore.privateKey);
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
