import { cheerio } from '@/vendor/cheerio';
import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';

function strIsDefined(str: string | undefined): str is string {
  return str !== undefined;
}

function getImageUris(html: string) {
  const $ = cheerio.load(html);
  return $('img')
    .get()
    .map((e) => $(e).attr('src'))
    .filter(strIsDefined);
}

function getSectionIds(html: string) {
  const $ = cheerio.load(html);
  return $('a[name]')
    .get()
    .map((e) => $(e).attr('name'))
    .filter(strIsDefined);
}

export function makeArticle(idString: string, title: string, bodyHtml: string) {
  const id = new ArticleId(idString);
  const body = new RichText(sanitizeHtml, bodyHtml);
  const sectionIds = getSectionIds(bodyHtml);
  return new Article(id, title, body, sectionIds, getImageUris);
}
