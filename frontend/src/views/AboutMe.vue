<template>hi</template>

<script>
// Constants
import { ABOUT_ME_PAGE_VISITED_KEY } from "@/constants.js";

export default {
  name: "AboutMe",
  emits: ["page-visited"],

  mounted() {
    document.title = "About Imad Saddik";
    this.$emit("page-visited", ABOUT_ME_PAGE_VISITED_KEY);
  },
};
</script>

<style scoped></style>
