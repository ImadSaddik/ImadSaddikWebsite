<template>
  <section class="article-header">
    <h1 class="article-header-title">{{ title }}</h1>
    <p class="article-header-subtitle">{{ subTitle }}</p>
    <div class="article-header-tags">
      <BaseTag v-for="tag in articleTags" :key="tag" :name="tag" />
    </div>

    <img class="article-header-cover-image" :src="coverImage" alt="" />
    <div class="article-header-meta-row">
      <p class="article-header-meta-info">{{ creationDate }} - {{ readingTime }} min read</p>
      <div class="article-header-share-buttons">
        <p class="article-header-share-title">Share:</p>
        <button class="article-header-share-button" @click="shareOnTwitter" title="Share on Twitter">
          <img :src="twitterLogo" alt="Share on Twitter" />
        </button>
        <button class="article-header-share-button" @click="shareOnLinkedIn" title="Share on LinkedIn">
          <img :src="linkedinLogo" alt="Share on LinkedIn" />
        </button>
        <button class="article-header-share-button" @click="copyLink" title="Copy link">
          <img :src="copyLinkIcon" alt="Copy link" />
        </button>
      </div>
    </div>
  </section>
</template>

<script>
// Logos
import linkedinLogo from "@/assets/logos/linkedin.svg";
import twitterLogo from "@/assets/logos/twitter.svg";
import copyLinkIcon from "@/assets/copy_link.svg";

// Components
import BaseTag from "@/components/BaseTag.vue";

export default {
  name: "ArticleHeader",
  emits: ["show-toast"],
  props: {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    articleTags: {
      type: Array,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    creationDate: {
      type: String,
      required: true,
    },
    readingTime: {
      type: String,
      required: true,
    },
  },
  components: {
    BaseTag,
  },
  data() {
    return {
      twitterLogo,
      linkedinLogo,
      copyLinkIcon,
    };
  },
  methods: {
    shareOnTwitter() {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent("Pre-filtering with kNN search in Elasticsearch");
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    },
    shareOnLinkedIn() {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    },
    async copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.$emit("show-toast", {
          message: "Link copied to clipboard!",
          type: "success",
        });
      } catch {
        this.$emit("show-toast", {
          message: "Failed to copy link",
          type: "error",
        });
      }
    },
  },
};
</script>

<style scoped>
.article-header {
  width: 50%;
}

.article-header-title {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

.article-header-subtitle {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

.article-header-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-sm);
  margin-top: 0;
  margin-bottom: var(--gap-xl);
}

.article-header-cover-image {
  width: 100%;
  height: auto;
  margin-top: 0;
  margin-bottom: var(--gap-sm);
}

.article-header-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
  margin-bottom: var(--gap-xl);
}

.article-header-meta-info {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: 0;
}

.article-header-share-title {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: 0;
}

.article-header-share-buttons {
  display: flex;
  direction: row;
  align-items: center;
  gap: var(--gap-xs);
}

.article-header-share-button {
  background: transparent;
  border: 1px solid var(--color-text-disabled);
  color: var(--color-text-secondary);
  padding: var(--gap-xs);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-header-share-button img {
  height: 16px;
  width: 16px;
}

.article-header-share-button:hover {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

@media screen and (max-width: 1500px) {
  .article-header {
    width: 100%;
  }
}

@media screen and (max-width: 1100px) {
  .article-header-title {
    font-size: var(--font-size-big-medium);
  }
}

@media screen and (max-width: 576px) {
  .article-header-meta-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .article-header-share-buttons {
    margin-top: var(--gap-sm);
  }
}
</style>
