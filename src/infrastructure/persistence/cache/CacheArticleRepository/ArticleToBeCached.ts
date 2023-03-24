import type { Article } from '@/domain/models/Article';

type ImageToBeCached = {
  originalUri: string;
  fileUri: string;
};

class ArticleToBeCached {
  constructor(
    public readonly article: Article,
    public readonly imagesToBeCached: ImageToBeCached[]
  ) {}
}

export { ArticleToBeCached };
