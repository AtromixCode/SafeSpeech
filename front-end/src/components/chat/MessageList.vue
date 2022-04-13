<template>
  <div class="messages-container">
    <div class="inner">
      <message
        v-for="(message, idx) in messages"
        :msg="message.content"
        :time="message.timestamp"
        :userMessage="user.username === message.username"
        :username="message.username"
        :key="idx"
      >
        {{ message }}
      </message>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { bus } from "@/main.js";
import Message from "./Message.vue";
export default {
  components: { Message },
  name: "MessageList",

  data() {
    return {
      currentId: "",
      messages: [],
    };
  },
  computed: { ...mapState({ user: (state) => state.user }) },
  methods: {
    ...mapMutations("user", ["setUserName", "setUserInfo", "resetUserInfo"]),
    resetMessages() {
      const isCurrentChat = (chat) => {
        return chat._id === this.currentId;
      };
      this.messages = [];
      let localChats = [];
      localChats = this.user.chats;
      this.messages = localChats.find(isCurrentChat).messages;
    },
  },
  mounted() {
    bus.$on("chat-click", (chatId) => {
      if (this.currentId != chatId) {
        this.currentId = chatId;
        this.resetMessages();
      }
    });
  },
};
</script>

<style scoped>
.messages-container {
  height: 95%;
  padding-right: 20px;
  padding-bottom: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
}
</style>
