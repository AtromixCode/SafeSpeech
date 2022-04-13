<template>
  <div class="bar">
    <div class="header">
      <b-button
        v-b-toggle.sidebar-1
        style="float: left; color: white; font-size: 1.25rem"
        variant="something"
        ><b-icon icon="justify"
      /></b-button>
      <chat-options class="chat-options" style="float: right" />
    </div>
    <b-sidebar
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
            <b-col md="auto">
              <b-button
                v-b-modal.modal
                style="color: white; font-size: 1.25rem"
                variant="something"
                aria-label="logout"
              >
                <img src="../../assets/NewUser.svg" />
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <chat-list :buttonList="buttons" />
      </template>
    </b-sidebar>

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
    createNewChat() {
      if (this.input.friends_username != "") {
        this.$socket.emit(
          "create chat",
          "",
          [],
          [this.user.username, this.input.friends_username]
        );
        this.$bvModal.hide("modal");
      }
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
}
</style>
