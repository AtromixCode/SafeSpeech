export default {
  namespaced: true,

  state: () => ({
    username: "",
    _id: "",
    chats: [
      {
        messages: [{ content: "", username: "", timestamp: Date }],
        _id: "",
        chatTitle: "",
        participants: [],
      },
    ],
  }),
  mutations: {
    setUserName(state, userName) {
      state.username = userName;
    },

    setUserInfo(state, userInfo) {
      Object.entries(userInfo).forEach(([k, v]) => {
        state[k] = v;
      });
      return state;
    },

    resetUserInfo(state) {
      console.log("doing something");
      let emptyState = {
        userName: "",
        _id: "",
        chats: [
          {
            messages: [{ content: "", username: "", timestamp: Date }],
            _id: "",
            chatTitle: "",
            participants: [],
          },
        ],
      };
      this.$store.replaceState(emptyState);
      return state;
    },
  },
};
