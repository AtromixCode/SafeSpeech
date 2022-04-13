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
                ><b-icon icon="door-open"
              /></b-button>
            </b-col>
          </b-row>
          <b-row
            ><span style="float: center" class="user-info">{{
              user.username
            }}</span></b-row
          >
        </b-container>
        <chat-list :buttonList="buttons" />
      </template>
    </b-sidebar>
  </div>
</template>

<script scoped>
import ChatOptions from "./ChatOptions.vue";
import { mapState } from "vuex";
import ChatList from "./ChatList.vue";
export default {
  components: { ChatOptions, ChatList },
  name: "SideBar",

  computed: {
    ...mapState({ user: (state) => state.user }),
    buttons() {
      let buttonProperties = this.user.chats.map((el) => {
        return { id: el._id, title: el.chatTitle, highlighted: false };
      });
      return buttonProperties;
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
