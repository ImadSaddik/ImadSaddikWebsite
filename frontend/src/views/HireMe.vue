<template>hi</template>

<script>
// Constants
import { HIRE_ME_PAGE_VISITED_KEY } from "@/constants.js";

export default {
  name: "HireMe",
  emits: ["page-visited"],

  mounted() {
    this.$emit("page-visited", HIRE_ME_PAGE_VISITED_KEY);
  },
};
</script>

<style scoped></style>
