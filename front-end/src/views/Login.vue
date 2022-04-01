<template>
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
</template>

<script>
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
        // This should actually be an api call not a check against this.$parent.mockAccount
        if (
          this.input.username == this.$parent.mockAccount.username &&
          this.input.password == this.$parent.mockAccount.password
        ) {
          this.$emit("authenticated", true);
          this.$router.replace({ name: "Secure" });
        } else {
          console.log("The username and / or password is incorrect");
        }
      } else {
        console.log("A username and password must be present");
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

input {
  width: 100%;
}

.bottomleft {
  position: absolute;
  bottom: 8px;
  left: 16px;
  font-size: 18px;
}

.bottomright {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 18px;
}
</style>
