import type { ArticleType } from '@/domain/models/Article';

export type TableOfContentsRow = {
  label: string;
  destination: string;
};

export type ArticleRow = {
  id: string;
  title: string;
  body: string;
  sectionIdsJson: string;
  cachedImagesJson: string;
  type: ArticleType;
};

export type MetadataRow = {
  lastUpdatedGmtIso: string;
};
