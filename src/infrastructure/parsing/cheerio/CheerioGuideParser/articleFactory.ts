import { cheerio } from '@/vendor/cheerio';
import {
  About,
  Article,
  ArticleId,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText/RichText';
import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';

function strIsDefined(str: string | undefined): str is string {
  return str !== undefined;
}

function getSectionIds(html: string) {
  const $ = cheerio.load(html);
  return $('a[name]')
    .get()
    .map((e) => $(e).attr('name'))
    .filter(strIsDefined);
}

export function makeArticle(
  idString: string,
  title: string,
  bodyHtml: string,
  sanitizeHtml: SanitizeHtml
) {
  const id = new ArticleId(idString);
  const body = new RichText(sanitizeHtml, bodyHtml);
  const sectionIds = getSectionIds(bodyHtml);
  return new Article(id, title, body, sectionIds);
}

export function makeAbout(bodyHtml: string, sanitizeHtml: SanitizeHtml) {
  const body = new RichText(sanitizeHtml, bodyHtml);
  const sectionIds = getSectionIds(bodyHtml);
  return new About(body, sectionIds);
}

export function makeIndex(bodyHtml: string, sanitizeHtml: SanitizeHtml) {
  const body = new RichText(sanitizeHtml, bodyHtml);
  const sectionIds = getSectionIds(bodyHtml);
  return new Index(body, sectionIds);
}

export function makeUsageInstructions(
  bodyHtml: string,
  sanitizeHtml: SanitizeHtml
) {
  const body = new RichText(sanitizeHtml, bodyHtml);
  const sectionIds = getSectionIds(bodyHtml);
  return new UsageInstructions(body, sectionIds);
}
