export default {
  namespaced: true,
  state: () => ({
    userName: "",
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
      console.log(state);
      state = {};
      console.log(state);
      Object.entries(userInfo).forEach(([k, v]) => {
        state[k] = v;
      });
      console.log(state);
    },

    resetUserInfo(state) {
      state = {
        userName: "",
        chats: [
          {
            messages: [{ timeStamp: "", content: "", from: "" }],
            lastUpdated: "",
            title: "",
            members: "",
          },
        ],
      };
      return state;
    },
  },
};
