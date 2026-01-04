import { onMounted } from "vue";
import { trackVisitorData } from "@/utils";

/**
 * Handles the standard lifecycle logic for Hub pages.
 * - Sets the document title
 * - Emits the page-visited event
 * - Tracks analytics data
 *
 * @param {Object} config
 * @param {string} config.pageKey - The PAGE_KEYS constant for this page
 * @param {string} config.title - The browser tab title
 * @param {Function} config.emit - The component's emit function
 */
export function useHubPage({ pageKey, title, emit }) {
  onMounted(() => {
    document.title = title;
    emit("page-visited", pageKey);
    trackVisitorData(pageKey);
  });
}
