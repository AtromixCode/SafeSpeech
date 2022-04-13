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
      state.userName = userName;
    },

    setUserInfo(state, userInfo) {
      Object.entries(userInfo).forEach(([k, v]) => {
        state[k] = v;
      });
      return state;
    },

    resetUserInfo(state) {
      let emptyState = {
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
      };
      Object.entries(emptyState).forEach(([k, v]) => {
        state[k] = v;
      });
    },
  },
};
