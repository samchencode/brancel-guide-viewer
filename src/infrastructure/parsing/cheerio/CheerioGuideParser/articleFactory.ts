import { cheerio } from '@/vendor/cheerio';
import {
  About,
  Article,
  ArticleId,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText/RichText';

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

export function makeArticle(idString: string, title: string, bodyHtml: string) {
  const id = new ArticleId(idString);
  const body = new RichText(bodyHtml);
  const sectionIds = getSectionIds(bodyHtml);
  return new Article(id, title, body, sectionIds);
}

export function makeAbout(bodyHtml: string) {
  const body = new RichText(bodyHtml);
  const sectionIds = getSectionIds(bodyHtml);
  return new About(body, sectionIds);
}

export function makeIndex(bodyHtml: string) {
  const body = new RichText(bodyHtml);
  const sectionIds = getSectionIds(bodyHtml);
  return new Index(body, sectionIds);
}

export function makeUsageInstructions(bodyHtml: string) {
  const body = new RichText(bodyHtml);
  const sectionIds = getSectionIds(bodyHtml);
  return new UsageInstructions(body, sectionIds);
}
