import { ref, watch, defineAsyncComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { PAGE_KEYS, TIME_OUT_MILLISECONDS } from "@/constants";
import axios from "axios";

/**
 * Composable to load article components and handle analytics.
 *
 * @param {Object} config
 * @param {Object} config.props - The component props (must contain slug)
 * @param {Object} config.registry - The map of lazy-loaded components (from registries/articles.js)
 * @param {string} config.section - The folder name in /src/ (e.g. 'blogs', 'courses')
 * @param {Function} config.emit - The component's emit function
 */
export function useArticleLoader({ props, registry, section, emit }) {
  const articleToDisplay = ref(null);
  const router = useRouter();

  watch(
    () => props.slug,
    async (newSlug) => {
      const path = `/src/${section}/${newSlug}/index.vue`;
      const loader = registry[path];

      if (loader) {
        articleToDisplay.value = defineAsyncComponent(loader);

        updateArticleCount({
          slug: newSlug,
          countType: "view",
          errorMessage: "Failed to increment view count",
        });
      } else {
        console.error(`Invalid ${section} slug: ${newSlug}`);
        router.replace({ name: "NotFound" });
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    emit("page-visited", PAGE_KEYS.OTHER);
  });

  async function handleArticleRead() {
    await updateArticleCount({
      slug: props.slug,
      countType: "read",
      errorMessage: "Failed to increment read count",
    });
  }

  /**
   * @param {Object} params
   * @param {string} params.slug
   * @param {'view' | 'read'} params.countType
   * @param {string} params.errorMessage
   */
  async function updateArticleCount({ slug, countType, errorMessage }) {
    const errorData = { message: errorMessage, type: "error" };

    try {
      const endpoint = `/api/articles/${slug}/increment-${countType}-count`;
      const response = await axios.patch(endpoint, { timeout: TIME_OUT_MILLISECONDS });
      const { success, message } = response.data;

      if (!success) {
        errorData.message += `: ${message}`;
        emit("show-toast", errorData);
      }
    } catch (e) {
      emit("show-toast", errorData);
    }
  }

  return {
    articleToDisplay,
    handleArticleRead,
  };
}
