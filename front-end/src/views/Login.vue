<template>
  <div v-if="!isMobile()">
    <div class="container">
      <div class="row">
        <div class="col">
          <img src="../assets/Logo.svg" class="mt-3" />

          <div id="login" class="login">
            <div>
              <b-form-input
                type="text"
                id="username"
                name="username"
                v-model="input.username"
                placeholder="Username"
              />
            </div>
            <div>
              <b-form-input
                type="password"
                id="password"
                name="password"
                v-model="input.password"
                placeholder="Password"
                class="mb-2"
              />
              <router-link to="/register">
                No Account? Register here!
              </router-link>
            </div>

            <b-button
              pill
              variant="dark"
              class="px-5 mx-4"
              v-on:click="login()"
            >
              Login
            </b-button>
            <b-button
              pill
              variant="outline-dark"
              type="button"
              class="btn btn-light px-5 mx-4"
              v-on:click="login()"
            >
              Cancel
            </b-button>
          </div>
          <b-alert
            variant="danger"
            dismissible
            fade
            :show="showDismissibleAlert"
            @dismissed="showDismissibleAlert = false"
          >
            {{ this.errorText }}
          </b-alert>
        </div>
        <div class="col"></div>
        <div class="col">
          <img src="../assets/Mobile.svg" style="margin-top: 30%" />
        </div>
      </div>
      <img src="../assets/leftCircle.svg" class="bottomleft" />
      <img src="../assets/rightCircle.svg" class="bottomright" />
    </div>
  </div>
  <div v-else>
    <div class="containermobile login">
      <div class="row">
        <div class="col">
          <img
            src="../assets/Logo.svg"
            width="70%"
            height="auto"
            class="mt-3"
          />
          <div id="loginmobile">
            <div>
              <b-form-input
                type="text"
                id="username"
                name="username"
                v-model="input.username"
                placeholder="Username"
              />
            </div>
            <div>
              <b-form-input
                type="password"
                id="password"
                name="password"
                v-model="input.password"
                placeholder="Password"
                class="mb-2"
              />
              <router-link to="/register">
                No Account? Register here!
              </router-link>
            </div>
            <b-button pill variant="dark" class="px-5 m-2" v-on:click="login()">
              Login
            </b-button>
            <b-button
              pill
              variant="outline-dark"
              type="button"
              class="btn btn-light px-5 m-2"
              v-on:click="login()"
            >
              Cancel
            </b-button>
          </div>
          <b-alert
            variant="danger"
            dismissible
            fade
            :show="showDismissibleAlert"
            @dismissed="showDismissibleAlert = false"
          >
            {{ this.errorText }}
          </b-alert>
        </div>
        <div class="row">
          <img
            src="../assets/Mobile.svg"
            height="220vh"
            style="margin-top: 10%"
          />
        </div>
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
/**
 * Allows users to log into the system to access their chats or register via the register button.
 *
 * Authors:
 * Nicholas Cervania
 * Jean-David Rousseau
 */
import bcrypt from "bcryptjs";
import { mapMutations } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      input: {
        username: "",
        password: "",
      },
      showDismissibleAlert: false,
      errorText: "",
    };
  },
  props: {
    msg: String,
  },
  methods: {
    /**
     * If function is called with username and password filled out, requests corresponding user info to perform validation
     * Yes technically the validation should be done on the server side but that requires sending plain text passwords over the internet. (TODO)
     */
    login() {
      // send request for salted password
      if (this.input.username !== "" && this.input.password !== "") {
        this.$socket.emit("get user", this.input.username);
      } else {
        this.errorText = "There must be a username and password";
        this.showDismissibleAlert = true;
      }
    },
    /**
     * Returns whether the user agent is on mobile or not.
     * @returns {boolean} true if mobile else false.
     */
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
    /**
     * routes the page to the chat view.
     */
    goToChat() {
      this.$router.push("/chat");
    },
    ...mapMutations("user", [
      "setUserName",
      "setUserInfo",
      "recieveMessage",
      "removeChat",
    ]),
  },
  mounted() {
    /**
     * Handles receiving information about the username, chekcs if salted password matches memory password.
     */
    this.$socket.on("user info", (userInfo) => {
      if (userInfo.password === null) {
        this.errorText = "Invalid username!";
        this.showDismissibleAlert = true;
      }
      bcrypt.compare(this.input.password, userInfo.password, (err, result) => {
        if (result) {
          console.log("It matches!");
          this.$socket.emit("logged in", userInfo.username);
          this.goToChat();
          this.setUserInfo(userInfo);
          console.log(userInfo);
        }
        // if passwords do not match
        else {
          this.errorText = "Invalid password!";
          this.showDismissibleAlert = true;
        }
      });
    });
  },
};
</script>

<style>
#login {
  padding-top: 100px;
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

.login .form-control {
  border-radius: 30px !important;
  box-shadow: 0px 5px 5px 0px rgb(180, 180, 180) !important;
  background-color: #f4fbff !important;
}
button.close {
  padding: 0;
  background-color: transparent;
  border: 0;
}
.alert-dismissible .close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  padding: 0.75rem 1.25rem;
  color: inherit;
}
.close {
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
}
</style>
