<template>
  <div>
    <message
      v-for="(message, idx) in messages"
      :msg="message.content"
      :time="message.timeStamp"
      :userMessage="user.userName === message.from"
      :username="message.from"
      :key="idx"
    >
      {{ message }}
    </message>
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
    ...mapMutations("user", ["setUserName", "setUserInfo"]),
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

<style></style>
