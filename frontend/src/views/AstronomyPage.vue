<template>hi</template>

<script>
// Constants
import { OTHER_PAGES_VISITED_KEY } from "@/constants.js";

export default {
  name: "AstronomyPage",
  emits: ["page-visited"],

  mounted() {
    this.$emit("page-visited", OTHER_PAGES_VISITED_KEY);
  },
};
</script>

<style scoped></style>
