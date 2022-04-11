<template>
  <div>
    <b-dropdown
      size="lg"
      variant="light"
      toggle-class="text-decoration-none"
      no-caret
      class="dropdown-btn"
    >
      <template #button-content> <b-icon icon="three-dots" /></template>
      <b-dropdown-item-button class="menu-button"
        >Leave Chat</b-dropdown-item-button
      >
    </b-dropdown>
  </div>
</template>

<script>
export default { name: "ChatOptions" };
</script>

<style>
.btn-light,
.btn:focus {
  background-color: transparent !important;
  border-color: transparent !important;
  color: inherit !important;
  outline: none !important;
  box-shadow: none !important;
}

.btn-check:checked + .btn-light,
.btn-check:active + .btn-light,
.btn-light:active,
.btn-light.active,
.btn-light:hover,
.show > .btn-light.dropdown-toggle {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #00bd9d !important;
  box-shadow: none !important;
}

.dropdown-item {
  background-color: #0d1b2a !important;
  color: white !important;
  height: 50px;
}

.dropdown-item:focus {
  background-color: white;
  color: #0d1b2a;
}

ul {
  padding: 0 !important;
}
</style>
