import { AVERAGE_READING_SPEED_WPM } from "@/constants";

export function calculateReadingTime(text) {
  const wordCount = text.trim().split(/\s+/).length;
  const time = Math.ceil(wordCount / AVERAGE_READING_SPEED_WPM);
  return time;
}

export function convertUnixTimestampToReadableFormat(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
