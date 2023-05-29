class ArticleSectionNotFoundError extends Error {
  name = 'ArticleNotFoundError';

  constructor(id: string) {
    super(`No article with section id of ${id} was found!`);
  }
}
export { ArticleSectionNotFoundError };
