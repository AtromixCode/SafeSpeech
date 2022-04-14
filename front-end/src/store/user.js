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
      return state;
    },

    recieveMessage(state, data) {
      const chatGettingMessage = (chat) => {
        return chat._id === data.chatId;
      };
      state.chats.find(chatGettingMessage).messages.push(data.msgPayload);
    },

    addChat(state, data) {
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
        userName: "",
        userId: "",
        chats: [
          {
            messages: [{ timeStamp: "", content: "", from: "" }],
            lastUpdated: "",
            title: "",
            members: "",
          },
        ],
      };
      Object.entries(emptyState).forEach(([k, v]) => {
        state[k] = v;
      });
    },
  },
};
