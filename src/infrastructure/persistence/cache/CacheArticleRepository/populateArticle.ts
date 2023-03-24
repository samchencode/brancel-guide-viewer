import { Article, ArticleId } from '@/domain/models/Article';
import type {
  ReplaceImageUrisInHtml,
  SanitizeHtml,
} from '@/domain/models/RichText';
import { RichText } from '@/domain/models/RichText';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import type { CachedArticle } from '@/infrastructure/persistence/cache/CacheArticleRepository/CachedArticle';

type UriToReplace = {
  originalUri: string;
  replaceWith?: string;
};

function hasReplacement(
  r: UriToReplace
): r is { originalUri: string; replaceWith: string } {
  return r.replaceWith !== undefined;
}

type UpdateCachedImage = (
  cachedArticle: CachedArticle,
  originalUri: string
) => Promise<void>;

const mimeTypes = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  WEBP: 'image/webp',
  SVG: 'image/svg+xml',
};

async function populateArticle(
  fileSystem: FileSystem,
  replaceImageUrisInHtml: ReplaceImageUrisInHtml,
  sanitizeHtml: SanitizeHtml,
  updateCachedImage: UpdateCachedImage,
  cachedArticle: CachedArticle
) {
  const promises = cachedArticle.cachedImages.map(
    async ({ originalUri, fileUri }) => {
      if (!(await fileSystem.checkFileExists(fileUri))) {
        updateCachedImage(cachedArticle, originalUri);
        return { originalUri };
      }
      const fileExtension = originalUri
        .match(/\.[a-zA-Z]{2,5}(?=[?#]|$)/)?.[0]
        ?.toLowerCase();
      const base64Image = await fileSystem.readFileAsString(fileUri, 'base64');
      let mimeType = mimeTypes.PNG;
      switch (fileExtension) {
        case '.png':
          mimeType = mimeTypes.PNG;
          break;
        case '.jpg':
        case '.jpeg':
          mimeType = mimeTypes.JPEG;
          break;
        case '.gif':
          mimeType = mimeTypes.GIF;
          break;
        case '.webp':
          mimeType = mimeTypes.WEBP;
          break;
        case '.svg':
          mimeType = mimeTypes.SVG;
          break;
        default:
          break;
      }
      return {
        originalUri,
        replaceWith: `data:${mimeType};base64,${base64Image}`,
      };
    }
  );
  const uriMap = (await Promise.all(promises)).filter(hasReplacement).reduce(
    (ag, { originalUri, replaceWith }) => ({
      ...ag,
      [originalUri]: replaceWith,
    }),
    {} as Record<string, string>
  );
  const bodyHtml = replaceImageUrisInHtml(cachedArticle.bodyHtml, uriMap);
  return new Article(
    new ArticleId(cachedArticle.idString),
    cachedArticle.title,
    new RichText(sanitizeHtml, bodyHtml),
    cachedArticle.sectionIds
  );
}

export { populateArticle };
