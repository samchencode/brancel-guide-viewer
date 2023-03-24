type ArticleImageJson = {
  originalUri: string;
  fileUri: string;
}[];

class CachedArticleImage {
  constructor(
    public readonly originalUri: string,
    public readonly fileUri: string
  ) {}

  static fromJsonArray(json: string) {
    const arr = JSON.parse(json) as ArticleImageJson;
    return arr.map((v) => new CachedArticleImage(v.originalUri, v.fileUri));
  }
}

export { CachedArticleImage };
