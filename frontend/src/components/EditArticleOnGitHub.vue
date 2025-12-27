<template>
  <section class="container">
    <a :href="githubEditUrl" target="_blank" rel="noopener noreferrer" class="edit-on-github-link">
      <i class="fa-solid fa-edit" aria-hidden="true"></i>
      Edit this page on GitHub
    </a>
  </section>
</template>

<script>
import { DIRECTORY_MAPPING } from "@/constants";

export default {
  name: "EditArticleOnGitHub",
  props: {
    slug: {
      type: String,
      required: true,
    },
    articleType: {
      type: String,
      required: true,
    },
  },
  computed: {
    githubEditUrl() {
      const baseRepoUrl = "https://github.com/ImadSaddik/ImadSaddikWebsite/edit/master";
      const directory = DIRECTORY_MAPPING[this.articleType];
      const filePath = `frontend/src/${directory}/${this.slug}/index.vue`;
      return `${baseRepoUrl}/${filePath}`;
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: var(--gap-sm);
}

.edit-on-github-link {
  font-size: var(--font-size-small);
}
</style>
