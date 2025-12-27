import axios from "axios";

export async function trackVisitorData(visitedPageKey) {
  try {
    await axios.post("/api/visitors/track", {
      visited_page: visitedPageKey,
    });
  } catch {
    // Silent fail
  }
}
