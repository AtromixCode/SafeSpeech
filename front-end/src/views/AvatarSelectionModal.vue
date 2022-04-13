<script>
export default {
  props: {
    show: Boolean,
  },
};
</script>

<template>
  <div v-if="!isMobile()">
    <Transition name="modal">
      <div v-if="show" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-body">
              <img
                src="../assets/ProfilePicture1.svg"
                @click="selectAvatar('ProfilePicture1.svg', $event)"
              />
              <img
                src="../assets/ProfilePicture2.svg"
                @click="selectAvatar('ProfilePicture2.svg', $event)"
              />
            </div>

            <div class="modal-footer">
              <button class="btn btn-dark" @click="registerAvatar">
                Select
              </button>
              <button class="btn btn-light" @click="$emit('close')">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  <div v-else>
    <Transition name="modal">
      <div v-if="show" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container-mobile">
            <div class="modal-body-mobile">
              <img
                src="../assets/ProfilePicture1.svg"
                @click="selectAvatar('ProfilePicture1.svg', $event)"
              />
              <img
                src="../assets/ProfilePicture2.svg"
                @click="selectAvatar('ProfilePicture2.svg', $event)"
              />
            </div>
            <div class="modal-footer">
              <button class="btn btn-dark" @click="registerAvatar">
                Select
              </button>
              <button class="btn btn-light" @click="$emit('close')">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected_avatar: {},
    };
  },
  props: {
    show: Boolean,
  },
  methods: {
    selectAvatar(avatar, event) {
      if (this.activeLink) {
        this.activeLink.classList.remove("selected");
      }
      this.activeLink = event.target;
      this.activeLink.classList.add("selected");

      this.selected_avatar = avatar;
      console.log(this.selected_avatar);
    },
    registerAvatar() {
      this.$emit("saveAvatar", this.selected_avatar);
      this.$emit("close");
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
.selected {
  border: 5px solid green;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-footer {
  text-align: center;
}

.modal-footer > button {
  width: 300px;
  height: 40px;
}

.modal-container {
  width: 700px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-container-mobile {
  width: 80vw;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-body {
  margin: 20px 0;
}

.modal-body-mobile {
  margin: 10px 0;
}
</style>
