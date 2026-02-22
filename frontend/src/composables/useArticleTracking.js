import axios from "axios";
import { inject } from "vue";
import { TIME_OUT_MILLISECONDS, ARTICLE_COUNT_TYPES } from "@/constants";

export function useArticleTracking() {
  const showToast = inject("showToast");

  const rateLimitErrorMessages = {
    [ARTICLE_COUNT_TYPES.VIEW]: "Hold up! You're refreshing too much. Please wait a minute before trying again.",
    [ARTICLE_COUNT_TYPES.READ]: "Slow down! You're reading too fast. Please wait a minute before trying again.",
    [ARTICLE_COUNT_TYPES.CLAPS]:
      "Woah there! You are hammering the button too fast. Please wait a minute before clapping again.",
  };

  async function incrementViewCount(slug) {
    await incrementMetric({
      slug,
      countType: ARTICLE_COUNT_TYPES.VIEW,
      errorMessage: "Failed to increment view count",
    });
  }

  async function incrementReadCount(slug) {
    await incrementMetric({
      slug,
      countType: ARTICLE_COUNT_TYPES.READ,
      errorMessage: "Failed to increment read count",
    });
  }

  async function incrementClapCount(slug) {
    return await incrementMetric({
      slug,
      countType: ARTICLE_COUNT_TYPES.CLAPS,
      errorMessage: "Failed to increment clap count",
      returnData: true,
    });
  }

  async function fetchInitialClapCount(slug) {
    try {
      const response = await axios.get(`/api/articles/${slug}/claps-count`);
      const { success, claps_count } = response.data;

      if (success) {
        return claps_count;
      } else {
        throw new Error("Failed to fetch initial clap count");
      }
    } catch (error) {
      showToast({ message: "Failed to fetch initial clap count", type: "error" });
      return null;
    }
  }

  async function incrementMetric({ slug, countType, errorMessage, returnData = false }) {
    const errorData = { message: errorMessage, type: "error" };

    try {
      const endpoint = `/api/articles/${slug}/increment-${countType}-count`;
      const response = await axios.patch(endpoint, { timeout: TIME_OUT_MILLISECONDS });
      const { success, message, ...rest } = response.data;

      if (!success) {
        errorData.message += `: ${message}`;
        showToast(errorData);
        return null;
      }

      return returnData ? rest : null;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        showToast({
          message: rateLimitErrorMessages[countType],
          type: "warning",
        });
      } else {
        showToast(errorData);
      }
      return null;
    }
  }

  return { incrementViewCount, incrementReadCount, incrementClapCount, fetchInitialClapCount };
}
