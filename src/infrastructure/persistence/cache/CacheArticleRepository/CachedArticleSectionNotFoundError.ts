class CachedArticleSectionNotFoundError extends Error {
  name = 'CachedArticleSectionNotFoundError';

  constructor(id: string) {
    super();
    this.message = `Cached article containing section with id of ${id} could not be found.`;
  }
}

export { CachedArticleSectionNotFoundError };
