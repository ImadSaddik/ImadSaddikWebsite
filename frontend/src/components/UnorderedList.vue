<template>
  <div class="unordered-list">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "UnorderedList",
};
</script>

<style scoped>
.unordered-list {
  display: flex;
  flex-direction: column;
}
</style>
