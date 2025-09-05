<template>hi</template>

<script>
// Constants
import { ABOUT_ME_PAGE_VISITED_KEY } from "@/constants.js";

export default {
  name: "AboutMe",
  emits: ["page-visited"],

  mounted() {
    this.$emit("page-visited", ABOUT_ME_PAGE_VISITED_KEY);
  },
};
</script>

<style scoped></style>
