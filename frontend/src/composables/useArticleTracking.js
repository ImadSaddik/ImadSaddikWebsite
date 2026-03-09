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
    return await incrementMetric({
      slug,
      countType: ARTICLE_COUNT_TYPES.VIEW,
      errorMessage: "Failed to increment view count",
    });
  }

  async function incrementReadCount(slug) {
    return await incrementMetric({
      slug,
      countType: ARTICLE_COUNT_TYPES.READ,
      errorMessage: "Failed to increment read count",
    });
  }

  async function incrementClapCount(slug, count = 1) {
    return await incrementMetric({
      slug,
      countType: ARTICLE_COUNT_TYPES.CLAPS,
      errorMessage: "Failed to increment clap count",
      count,
    });
  }

  /**
   * Sends a fire-and-forget clap count update using the Fetch API with `keepalive: true`,
   * ensuring the request is delivered even if the page is being unloaded.
   * Use this instead of `incrementClapCount` when the component is unmounting or the page is hiding.
   * @param {string} slug - The article slug.
   * @param {number} count - The number of claps to submit.
   */
  function sendBeaconClapCount(slug, count) {
    fetch(`/api/articles/${slug}/increment-claps-count`, {
      keepalive: true,
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ count }),
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

  async function incrementMetric({ slug, countType, errorMessage, count }) {
    const errorData = { message: errorMessage, type: "error" };

    try {
      const endpoint = `/api/articles/${slug}/increment-${countType}-count`;
      const body = count !== undefined ? { count } : {};
      const response = await axios.patch(endpoint, body, { timeout: TIME_OUT_MILLISECONDS });
      const { success, message, ...rest } = response.data;

      if (!success) {
        errorData.message += `: ${message}`;
        showToast(errorData);
        return null;
      }

      return rest;
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

  return { incrementViewCount, incrementReadCount, incrementClapCount, fetchInitialClapCount, sendBeaconClapCount };
}
