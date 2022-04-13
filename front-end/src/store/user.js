export default {
  namespaced: true,
  state: () => ({
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
