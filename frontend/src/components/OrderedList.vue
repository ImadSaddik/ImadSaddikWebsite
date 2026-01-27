<template>
  <div class="ordered-list">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "OrderedList",
};
</script>

<style scoped>
.ordered-list {
  display: flex;
  flex-direction: column;
}
</style>
