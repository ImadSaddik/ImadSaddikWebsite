<template>
  <img :src="icon" :alt="alt" class="inline-icon" />
</template>

<script>
export default {
  name: "InlineIcon",
  props: {
    icon: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "icon",
    },
  },
};
</script>

<style scoped>
.inline-icon {
  display: inline-block;
  margin: 0 var(--gap-xxs);
  width: auto;
  height: 1.2em;
  vertical-align: text-bottom;
}
</style>
