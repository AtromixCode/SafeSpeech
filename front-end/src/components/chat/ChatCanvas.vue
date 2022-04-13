<template>
  <b-container>
    <b-row>
      <div class="header">
        <chat-options class="chat-options" style="float: right" />
      </div>
    </b-row>
    <b-row class="chat-display"></b-row>
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
import ChatOptions from "./ChatOptions.vue";
import { mapMutations, mapState } from "vuex";

export default {
  name: "ChatCanvas",
  components: { ChatOptions },
  data() {
    return {
      msgInput: "",
      currentChatId: "",
    };
  },
  computed: { ...mapState({ user: (state) => state.user }) },
  methods: {
    ...mapMutations("user", ["setUserName", "setUserInfo"]),
    sendMessage() {
      let payload = {
        content: this.msgInput,
        chatId: this.currentChatId,
        from: this.$store.state.user.userName,
      };
      this.$socket.emit("message", payload);
    },
    addMessageToUI(msg) {
      // TODO add to the UI
      console.log(msg.content);
      if (msg.username === this.$store.state.user.username) {
        console.log("from ME");
      } else {
        console.log(msg.username);
      }
    },
    updateUIWithChatMessages() {
      const curChat = this.user.chats.find((chat) => {
        return chat._id === this.currentChatId;
      });
      // console.log(curChat);
      curChat.messages.forEach(this.addMessageToUI);
    },
  },
  created() {
    // hardcode a username in store
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
  },
};
</script>

<style scoped>
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
