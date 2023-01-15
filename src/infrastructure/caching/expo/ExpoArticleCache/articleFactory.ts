import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';

function makeArticle(
  idString: string,
  title: string,
  bodyHtml: string,
  sectionIdsJson: string
) {
  const id = new ArticleId(idString);
  const body = new RichText(sanitizeHtml, bodyHtml);
  const sectionIds = JSON.parse(sectionIdsJson) as string[];
  return new Article(id, title, body, sectionIds);
}

function cloneArticleWithNewHtml(article: Article, newHtml: string) {
  const body = new RichText(sanitizeHtml, newHtml);
  const sectionIds = Array.from(article.sectionIds);
  return new Article(article.id, article.title, body, sectionIds);
}

export { makeArticle, cloneArticleWithNewHtml };
