class GuideArticleSectionNotFoundError extends Error {
  name = 'WpApiArticleNotFoundError';

  constructor(id: string) {
    super(`No article with section id of ${id} was found!`);
  }
}
export { GuideArticleSectionNotFoundError };
