<template>
  <sup>{{ text }}</sup>
</template>

<script>
export default {
  name: "SuperscriptText",
  props: {
    text: {
      type: [String, Number],
      required: true,
    },
  },
};
</script>

<style scoped>
sup {
  font-size: 0.75rem;
  vertical-align: super;
  line-height: 0;
  position: relative;
  top: -0.3rem;
}
</style>
