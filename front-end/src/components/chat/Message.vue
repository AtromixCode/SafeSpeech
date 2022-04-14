<template>
  <div style="display: flex" class="py-2" v-if="!userMessage">
    <div style="display: flex; flex-direction: column">
      <div style="align-self: flex-start">
        <p>
          <font
            ><em>{{ username }}</em></font
          >
        </p>
      </div>

      <p style="background: #2a8bf2; border-radius: 5px; padding: 5px">
        {{ msg }}
      </p>
      <div style="align-self: flex-start">
        <font
          ><em>{{ time }}</em></font
        >
      </div>
    </div>
  </div>
  <div style="display: flex; justify-content: flex-end" class="py-2" v-else>
    <div style="display: flex; flex-direction: column">
      <div style="align-self: flex-end">
        <p>
          <font>
            <em>{{ username }} </em></font
          >
        </p>
      </div>
      <p style="background: #00bd9d; border-radius: 5px; padding: 5px">
        {{ msg }}
      </p>
      <div style="align-self: flex-end">
        <font
          ><em>{{ time }}</em></font
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message-s",
  data() {
    return {};
  },
  props: {
    msg: String,
    userMessage: Boolean,
    username: String,
    time: String,
  },
};
</script>

<style scoped>
* {
  margin: 0px !important;
}

font {
  color: black;
}
</style>
