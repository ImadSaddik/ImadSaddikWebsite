import { inject } from "vue";
import { TIME_OUT_MILLISECONDS } from "@/constants";
import axios from "axios";

export function useArticleTracking() {
  const showToast = inject("showToast");

  const rateLimitErrorMessages = {
    view: "Hold up! You're refreshing too much. Please wait a minute before trying again.",
    read: "Hold up! You're reading too much. Please wait a minute before trying again.",
  };

  async function incrementViewCount(slug) {
    await updateArticleCount({
      slug,
      countType: "view",
      errorMessage: "Failed to increment view count",
    });
  }

  async function incrementReadCount(slug) {
    await updateArticleCount({
      slug,
      countType: "read",
      errorMessage: "Failed to increment read count",
    });
  }

  async function updateArticleCount({ slug, countType, errorMessage }) {
    const errorData = { message: errorMessage, type: "error" };

    try {
      const endpoint = `/api/articles/${slug}/increment-${countType}-count`;
      const response = await axios.patch(endpoint, { timeout: TIME_OUT_MILLISECONDS });
      const { success, message } = response.data;

      if (!success) {
        errorData.message += `: ${message}`;
        showToast(errorData);
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        showToast({
          message: rateLimitErrorMessages[countType],
          type: "warning",
        });
      } else {
        showToast(errorData);
      }
    }
  }

  return { incrementViewCount, incrementReadCount };
}
