<template>
  <section>
    <a :href="githubEditUrl" target="_blank" rel="noopener noreferrer" class="edit-on-github-link">
      <i class="fas fa-edit" aria-hidden="true"></i>
      Edit this page on GitHub
    </a>
  </section>
</template>

<script>
export default {
  name: "EditArticleOnGitHub",
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  computed: {
    githubEditUrl() {
      const baseRepoUrl = "https://github.com/ImadSaddik/ImadSaddikWebsite/edit/master";
      const filePath = `frontend/src/blogs/${this.slug}/index.vue`;
      return `${baseRepoUrl}/${filePath}`;
    },
  },
};
</script>

<style scoped>
.edit-on-github-link {
  font-size: var(--font-size-small);
}
</style>
