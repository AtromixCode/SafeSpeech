<template>
  <div style="display: flex" class="py-2" v-if="!userMessage">
    <div style="display: flex; flex-direction: column">
      <p>
        <font>{{ username }}</font>
      </p>
      <p style="background: LightBlue; border-radius: 5px; padding: 5px">
        {{ msg }}
      </p>
      <font
        ><em>{{ time }}</em></font
      >
    </div>
  </div>
  <div style="display: flex; justify-content: flex-end" v-else>
    <div style="display: flex; flex-direction: column">
      <p>
        <font>{{ username }}</font>
      </p>
      <p style="background: LightSkyBlue; border-radius: 5px; padding: 5px">
        {{ msg }}
      </p>
      <font
        ><em>{{ time }}</em></font
      >
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
