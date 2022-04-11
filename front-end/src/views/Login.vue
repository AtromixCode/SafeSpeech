<template>
  <div v-if="!isMobile()">
    <div class="container">
      <div class="row">
        <div class="col">
          <img src="../assets/Logo.svg" />

          <div id="login">
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
              <router-link to="/register">
                No Account? Register here!
              </router-link>
            </div>
            <button type="button" class="btn btn-dark" v-on:click="login()">
              Login
            </button>
            <button type="button" class="btn btn-light" v-on:click="login()">
              Cancel
            </button>
          </div>
        </div>
        <div class="col"></div>
        <div class="col"><img src="../assets/Mobile.svg" /></div>
      </div>
      <img src="../assets/leftCircle.svg" class="bottomleft" />
      <img src="../assets/rightCircle.svg" class="bottomright" />
    </div>
  </div>
  <div v-else>
    <div class="containermobile">
      <div class="row">
        <div class="col">
          <img src="../assets/Logo.svg" width="70%" height="auto" />
          <div id="loginmobile">
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
              <router-link to="/register">
                No Account? Register here!
              </router-link>
            <button type="button" class="btn btn-light" v-on:click="login()">
              Cancel
            </button>
          </div>
        </div>
        <div class="col"><img src="../assets/Mobile.svg" height="220vh" /></div>
        <div>
          <img
            src="../assets/leftCircle.svg"
            class="bottomleftmobile"
            width="40%"
            height="40%"
          />
          <img
            src="../assets/rightCircle.svg"
            class="bottomrightmobile"
            width="40%"
            height="40%"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const bcrypt = require("bcrypt");
const saltRounds = 10;

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

var socket = io();

export default {
  name: "LoginView",
  data() {
    return {
      input: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      if (this.input.username != "" && this.input.password != "") {
        var username = this.input.username;
        var password = this.input.password;
        var saltedHash = bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {});
        });

        socket.emit("check login credentials", {
          userName: username,
          password: saltedHash,
        });

        socket.on("login ok", function (user) {
          //login
          this.$router.push("/chat");
        });

        socket.on("bad credentials", function () {
          //throw error
          alert("bad credentials");
        });
      } else {
        console.log("A username and password must be present");
      }
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
#login {
  padding-top: 100px;
}

#login > button {
  width: 100px;
  margin-left: 50px;
  margin-right: 50px;
}

#login > div {
  margin-bottom: 20px;
}

.containermobile {
  overflow-y: hidden;
  overflow-x: hidden;
}

#loginmobile {
  padding-top: 100px;
  align-content: center;
}

#loginmobile > div {
  margin-bottom: 20px;
}

#loginmobile > button {
  width: 100px;
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 15px;
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
