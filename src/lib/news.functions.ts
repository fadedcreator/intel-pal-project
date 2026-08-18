import { createServerFn } from "@tanstack/react-start";

import { loadArticles, computeTopics } from "./news.server";

export const getNews = createServerFn({ method: "GET" }).handler(async () => {
  const { articles, fetchedAt } = await loadArticles();
  return { articles, fetchedAt, topics: computeTopics(articles) };
});
