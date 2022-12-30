class ArticleId {
  constructor(public readonly id: string) {}

  toString() {
    return this.id;
  }

  is(other: ArticleId) {
    if (!(other instanceof ArticleId)) return false;
    return this.id === other.id;
  }
}

export { ArticleId };
