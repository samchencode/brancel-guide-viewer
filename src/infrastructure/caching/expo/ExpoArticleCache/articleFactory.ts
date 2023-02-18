import { Article, ArticleId } from '@/domain/models/Article';
import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';
import { RichText } from '@/domain/models/RichText/RichText';

function makeArticle(
  idString: string,
  title: string,
  bodyHtml: string,
  sectionIdsJson: string,
  sanitizeHtml: SanitizeHtml
) {
  const id = new ArticleId(idString);
  const body = new RichText(sanitizeHtml, bodyHtml);
  const sectionIds = JSON.parse(sectionIdsJson) as string[];
  return new Article(id, title, body, sectionIds);
}

function cloneArticleWithNewHtml(
  article: Article,
  newHtml: string,
  sanitizeHtml: SanitizeHtml
) {
  const body = new RichText(sanitizeHtml, newHtml);
  const sectionIds = Array.from(article.sectionIds);
  return new Article(article.id, article.title, body, sectionIds);
}

export { makeArticle, cloneArticleWithNewHtml };
