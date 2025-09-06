function calculateReadingTime(refs) {
  const WORDS_PER_MINUTE = 200;
  const articleText = refs.articleContent.$el.innerText;
  const wordCount = articleText.trim().split(/\s+/).length;
  const time = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return time;
}

function convertUnixTimestampToReadableFormat(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getCardsDataFromDocumentHits({ hits, articleType }) {
  const directoryMapping = {
    "blog-post": "blogs",
    "course-post": "courses",
    "astronomy-post": "astronomy",
  };

  return hits.map((hit) => ({
    imageSrc: require(`@/${directoryMapping[articleType]}/${hit.name}/coverImage.svg`),
    altText: `Cover image for the ${articleType} titled ${hit.title}`,
    title: hit.title,
    subTitle: convertUnixTimestampToReadableFormat(hit.creation_date),
    articleType: articleType,
    articleId: hit.name,
    viewCount: hit.view_count,
    readCount: hit.read_count,
  }));
}

export { calculateReadingTime, convertUnixTimestampToReadableFormat, getCardsDataFromDocumentHits };
