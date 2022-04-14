export default {
  namespaced: true,
  state: () => ({
    username: "",
    chats: [
      {
        messages: [{ timestamp: "", content: "", username: "" }],
        participants: [{ username: "" }],
        chatTitle: "",
        _id: "",
      },
    ],
  }),
  mutations: {
    setUserName(state, username) {
      state.username = username;
    },

    setUserInfo(state, userInfo) {
      Object.entries(userInfo).forEach(([k, v]) => {
        state[k] = v;
      });

      const notUser = (username) => {
        return username.username != state.username;
      };

      state.chats.forEach((chat) => {
        if (chat.chatTitle === "" || chat.chatTitle === null) {
          chat.chatTitle = chat.participants.find(notUser).username;
        }
      });
      return state;
    },

    recieveMessage(state, data) {
      const chatGettingMessage = (chat) => {
        return chat._id === data.chatId;
      };
      state.chats.find(chatGettingMessage).messages.push(data.msgPayload);
    },

    addChat(state, data) {
      const notUser = (username) => {
        return username.username != state.username;
      };
      if (data.chatTitle === "" || data.chatTitle === null) {
        data.chatTitle = data.chat.participants.find(notUser).username;
      }
      state.chats.push(data);
    },

    removeChat(state, chatId) {
      const deletedChat = (chat) => {
        return chat._id != chatId;
      };
      const chats = state.chats.filter(deletedChat);
      state.chats = chats;
    },

    resetUserInfo(state) {
      let emptyState = {
        username: "",
        chats: [
          {
            messages: [{ timestamp: "", content: "", username: "" }],
            participants: [{ username: "" }],
            chatTitle: "",
            _id: "",
          },
        ],
      };
      Object.entries(emptyState).forEach(([k, v]) => {
        state[k] = v;
      });
    },
  },
};
