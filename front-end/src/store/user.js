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
