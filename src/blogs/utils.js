function calculateReadingTime(refs) {
  const WORDS_PER_MINUTE = 200;
  const articleText = refs.articleContent.$el.innerText;
  const wordCount = articleText.trim().split(/\s+/).length;
  const time = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return time;
}

export { calculateReadingTime };
