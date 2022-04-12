<template>
  <div v-if="!isMobile()">
    <div class="container">
      <div class="row">
        <div class="col">
          <img src="../assets/Logo.svg" />
          <div id="register">
            <p>Choose a profile avatar</p>
            <img :src="avatar_preview" @click="showModal = true" />
            <div class="form-control">
              <input
                type="text"
                id="username"
                name="username"
                v-model="input.username"
                placeholder="Username"
              />
            </div>
            <div class="form-control">
              <input
                type="password"
                id="password"
                name="password"
                v-model="input.password"
                placeholder="Password"
              />
            </div>
            <div class="form-control">
              <input
                type="password"
                id="password-confirm"
                name="password-confirm"
                v-model="input.password_confirm"
                placeholder="Confirm password"
              />
              <router-link to="/">Have an account? Login here!</router-link>
            </div>
            <button type="button" class="btn btn-dark" v-on:click="register()">
              Register
            </button>
            <button type="button" class="btn btn-light" v-on:click="register()">
              Cancel
            </button>
          </div>
        </div>
        <div class="col"></div>
        <div class="col"><img src="../assets/Mobile.svg" /></div>
      </div>
      <img src="../assets/leftCircle.svg" class="bottomleft" />
      <img src="../assets/rightCircle.svg" class="bottomright" />

      <Teleport to="body">
        <!-- use the modal component, pass in the prop -->
        <modal
          :show="showModal"
          @close="showModal = false"
          @saveAvatar="saveAvatar"
        >
          <template #header>
            <h3>custom header</h3>
          </template>
        </modal>
      </Teleport>
    </div>
  </div>
  <div v-else>
    <div class="container">
      <div class="row">
        <div class="col">
          <img src="../assets/Logo.svg" width="70%" height="auto" />
          <div id="registermobile">
            <p>Choose a profile avatar</p>
            <img :src="avatar_preview" @click="showModal = true" />
            <div class="form-control">
              <input
                type="text"
                id="username"
                name="username"
                v-model="input.username"
                placeholder="Username"
              />
            </div>
            <div class="form-control">
              <input
                type="password"
                id="password"
                name="password"
                v-model="input.password"
                placeholder="Password"
              />
            </div>
            <div class="form-control">
              <input
                type="password"
                id="password-confirm"
                name="password-confirm"
                v-model="input.password_confirm"
                placeholder="Confirm password"
              />
              <router-link to="/"> Have an account? Login here! </router-link>
            </div>
            <button type="button" class="btn btn-dark" v-on:click="register()">
              Register
            </button>
            <button type="button" class="btn btn-light" v-on:click="register()">
              Cancel
            </button>
          </div>
        </div>
        <div class="col"><img src="../assets/Mobile.svg" height="220vh" /></div>
      </div>
      <img
        src="../assets/leftCircle.svg"
        class="bottomleftmobile"
        height="40%"
        width="40%"
      />
      <img
        src="../assets/rightCircle.svg"
        class="bottomrightmobile"
        height="40%"
        width="40%"
      />
      <Teleport to="body">
        <!-- use the modal component, pass in the prop -->
        <modal
          :show="showModal"
          @close="showModal = false"
          @saveAvatar="saveAvatar"
        >
          <template #header>
            <h3>custom header</h3>
          </template>
        </modal>
      </Teleport>
    </div>
  </div>
</template>

<script>
import Modal from "./AvatarSelectionModal.vue";
const bcrypt = require("bcrypt");
const saltRounds = 10;

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

var socket = io();

export default {
  name: "RegisterView",
  data() {
    return {
      showModal: false,
      avatar_preview: "/img/ProfilePicture1.b2c1f36d.svg",
      input: {
        username: "",
        password: "",
      },
    };
  },
  components: {
    Modal,
  },
  methods: {
    register() {
      if (this.input.username != "" && this.input.password != "") {
        var username = this.input.username;
        var password = this.input.password;
        var saltedHash = bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {});
        });
        // store saltedHash and username in DB
        socket.emit("check new login", {
          userName: username,
          password: saltedHash,
          pofilePicture: avatar,
        });
        socket.on("ok username", function () {
          this.$router.push("/chat");
        });
        socket.on("bad username", function () {
          alert("username taken, pick another one");
        });
        // route to chat page
      } else {
        console.log("A username and password must be present");
      }
    },
    saveAvatar(avatar) {
      // Save the avatar path and replaces the preview image.
      this.avatar_preview = avatar;
      this.selected_avatar = avatar;
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style>
#register {
  padding-top: 100px;
}

#register > button {
  width: 100px;
  margin-left: 50px;
  margin-right: 50px;
}

#register > div {
  margin-bottom: 20px;
}

#registermobile {
  padding-top: 10px;
}

#registermobile > button {
  width: 100px;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
}

#registermobile > div {
  margin-bottom: 20px;
}

input {
  width: 100%;
}

.bottomleft {
  position: absolute;
  bottom: 8px;
  left: 16px;
  font-size: 18px;
}

.bottomleftmobile {
  position: fixed;
  bottom: -100px;
  left: 0px;
  font-size: 18px;
  z-index: -1;
}

.bottomright {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 18px;
}

.bottomrightmobile {
  position: fixed;
  bottom: -100px;
  right: 0px;
  font-size: 18px;
  z-index: -1;
}
</style>
