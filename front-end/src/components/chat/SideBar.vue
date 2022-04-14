<template>
  <div class="bar">
    <div class="header">
      <b-button
        v-b-toggle.sidebar-1
        style="float: left; color: white; font-size: 1.25rem"
        variant="something"
        class="open-sidebar"
        ><b-icon icon="justify"
      /></b-button>
      <chat-options class="chat-options" style="float: right" />
    </div>
    <b-sidebar
      v-if="collapsable()"
      id="sidebar-1"
      title="Sidebar"
      bg-variant="none"
      shadow
      no-header
      no-close-on-esc
      no-close-on-route-change
      visible
    >
      <template #default>
        <b-container>
          <b-row class="justify-content-md-end">
            <b-col md="auto">
              <b-button
                style="float: right; color: white; font-size: 1.25rem"
                variant="something"
                aria-label="logout"
                v-on:click="logout"
                ><b-icon icon="door-open"
              /></b-button>
            </b-col>
          </b-row>
          <b-row
            ><span style="float: center" class="user-info">{{
              user.username
            }}</span></b-row
          >
          <b-row>
            <div>
              <b-button v-b-modal.modal variant="something" class="chat-btn">
                <img src="../../assets/NewUser.svg" class="chat-btn-icon" />
              </b-button>
              <b-button v-b-modal.modal-1 variant="something" class="chat-btn">
                <img src="../../assets/GroupChat.svg" class="chat-btn-icon" />
              </b-button>
            </div>
          </b-row>
          <b-row><chat-list /></b-row>
        </b-container>
      </template>
    </b-sidebar>

    <div v-else>
      <b-container>
        <b-row class="justify-content-md-end">
          <b-col md="auto">
            <b-button
              style="float: right; color: white; font-size: 1.25rem"
              variant="something"
              aria-label="logout"
              v-on:click="logout"
              ><b-icon icon="door-open"
            /></b-button>
          </b-col>
        </b-row>
        <b-row
          ><span style="float: center" class="user-info">{{
            user.username
          }}</span></b-row
        >
        <b-row>
          <div>
            <b-button v-b-modal.modal variant="something" class="chat-btn">
              <img src="../../assets/NewUser.svg" class="chat-btn-icon" />
            </b-button>
            <b-button v-b-modal.modal-1 variant="something" class="chat-btn">
              <img src="../../assets/GroupChat.svg" class="chat-btn-icon" />
            </b-button>
          </div>
        </b-row>
        <b-row><chat-list /></b-row>
      </b-container>
    </div>

    <b-modal id="modal" title="BootstrapVue" hide-footer>
      <div class="form-control">
        <input
          type="text"
          placeholder="Friend's Username"
          v-model="input.friends_username"
        />
      </div>
      <div class="col-md-12 text-center">
        <b-button
          type="button"
          class="btn btn-dark"
          block
          v-on:click="createNewChat()"
        >
          Add
        </b-button>
        <b-button
          type="button"
          class="btn btn-light"
          block
          @click="$bvModal.hide('modal')"
        >
          Cancel
        </b-button>
      </div>
    </b-modal>

    <b-modal id="modal-1" title="BootstrapVue" hide-footer>
      <h1>Groupchat Settings</h1>
      <div class="form-control">
        Chat Name
        <input type="text" placeholder="New name" v-model="input.chatName" />
        <b-button
          v-b-modal.modal-1
          variant="something"
          v-on:click="addUserToGroupChatList()"
        >
          <img src="../../assets/addUser.svg" />
        </b-button>
        <input
          type="text"
          style="width: 50%"
          placeholder="Friend's username"
          v-model="input.groupChat_friends_username"
        />
        <ul>
          <li v-for="(item, idx) in groupChatUsers" :key="idx">
            {{ item.username }}
          </li>
        </ul>
      </div>
      <div class="col-md-12 text-center">
        <b-button
          type="button"
          class="btn btn-dark"
          block
          v-on:click="createGroupChat()"
        >
          Accept Changes
        </b-button>
        <b-button
          type="button"
          class="btn btn-light"
          block
          @click="$bvModal.hide('modal-1')"
        >
          Cancel
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script scoped>
import ChatOptions from "./ChatOptions.vue";
import { mapState, mapMutations } from "vuex";
import ChatList from "./ChatList.vue";
export default {
  components: { ChatOptions, ChatList },
  name: "SideBar",
  data() {
    return {
      input: {
        username: "",
      },
      groupChatUsers: [],
    };
  },
  computed: {
    ...mapState({ user: (state) => state.user }),
    buttons() {
      let buttonProperties = this.user.chats.map((el) => {
        return { id: el._id, title: el.chatTitle, highlighted: false };
      });
      return buttonProperties;
    },
  },
  methods: {
    collapsable() {
      return this.$screen.width < 1000;
    },
    createNewChat() {
      if (this.input.friends_username != "") {
        let participants = [];
        participants.push({ username: this.user.username });
        participants.push({ username: this.input.friends_username });
        this.$socket.emit("create chat", "", [], participants);
        this.$bvModal.hide("modal");
      }
    },
    createGroupChat() {
      this.groupChatUsers.push({ username: this.user.username });
      this.$socket.emit(
        "create chat",
        this.input.chatName,
        [],
        this.groupChatUsers
      );

      this.input.groupChat_friends_username = "";
      this.groupChatUsers = [];
      this.$bvModal.hide("modal-1");
    },
    closeModal() {
      this.$bvModal.hide("modal");
    },
    ...mapMutations("user", ["setUserName", "setUserInfo", "resetUserInfo"]),
    logout() {
      this.resetUserInfo();
      this.$socket.emit("logged out", this.user.username);
      this.$router.push("/");
    },
    addUserToGroupChatList() {
      //add the username to groupChatUsers
      if (this.input.groupChat_friends_username != "") {
        this.groupChatUsers.push({
          username: this.input.groupChat_friends_username,
        });
        this.input.groupChat_friends_username = "";
      }
    },
  },
  mounted() {
    /**
     * server oks the username, thus go to the chat page
     */
    this.$socket.on("ok username", () => {
      this.goToChat();
    });
  },
};
</script>

<style>
.container {
  padding: 0 !important;
  margin: 0 !important;
  max-width: 100% !important;
}

.row {
  margin: 0 !important;
  padding: 0 !important;
}

.b-sidebar {
  background-color: #2a8bf2 !important;
  height: 100%;
  overflow: hidden !important;
  width: 25% !important;
}

.bar {
  background-color: #2a8bf2 !important;
  height: 100%;
}

div {
  color: white;
}

button {
  display: inline-block;
}

.header {
  display: block;
}

@media screen and (max-width: 1000px) {
  .b-sidebar {
    position: absolute;
    background-color: #2a8bf2 !important;
    height: 100%;
    overflow: hidden !important;
    width: 100% !important;
    z-index: 9 !important;
  }

  .chat-btn-icon,
  .chat-btn {
    width: 12vh !important;
    height: 12vh !important;
  }
}

@media screen and (min-width: 1001px) {
  .open-sidebar {
    display: none !important;
  }

  .chat-options {
    display: none !important;
  }
}

.chat-btn {
  padding: 0 !important;
  margin: 12px !important;
  border: 0 !important;
}

.chat-btn-icon,
.chat-btn {
  width: 7vw;
  height: 7vw;
}
</style>
