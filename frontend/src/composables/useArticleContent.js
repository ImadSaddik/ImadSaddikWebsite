import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { calculateReadingTime } from "@/utils";
import { DEFAULT_ARTICLE_TITLE } from "@/constants";

/**
 * Composable to handle common article page logic:
 * - Setting the document title
 * - Calculating reading time based on Markdown content
 * - Emitting 'article-read' event
 *
 * @param {Object} config
 * @param {string} config.title - The title of the article
 * @param {Function} config.emit - The component's emit function
 * @param {string} config.content - The raw markdown content string of the article
 *
 * @returns {Object}
 * @returns {import('vue').ComputedRef<string>} slug - The article slug from route params
 * @returns {import('vue').Ref<number>} readingTime - The calculated reading time in minutes
 */
export function useArticleContent({ title, emit, content }) {
  let readTimer = null;

  const route = useRoute();
  const readingTime = ref(0);

  const slug = computed(() => route.params.slug);

  onMounted(() => {
    document.title = title || DEFAULT_ARTICLE_TITLE;

    if (content) {
      readingTime.value = calculateReadingTime(content);

      const thresholdMilliseconds = readingTime.value * 0.25 * 60 * 1000;
      readTimer = setTimeout(() => {
        emit("article-read");
      }, thresholdMilliseconds);
    }
  });

  onUnmounted(() => {
    if (readTimer) {
      clearTimeout(readTimer);
    }
  });

  return {
    slug,
    readingTime,
  };
}
