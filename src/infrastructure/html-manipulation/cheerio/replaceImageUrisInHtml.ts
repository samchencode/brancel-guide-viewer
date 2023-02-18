import { cheerio } from '@/vendor/cheerio';
import type {
  ReplaceImageUrisInHtml,
  ReplaceImageUrisInHtmlBody,
} from '@/domain/models/RichText/htmlManipulationUtils';

function replaceImageUri(
  $: cheerio.CheerioAPI,
  uri: string,
  replaceWith: string
) {
  $(`img[src="${uri}"]`).each((_, e) => {
    $(e).attr('src', replaceWith);
  });
}

export const replaceImageUrisInHtml: ReplaceImageUrisInHtml = (
  html: string,
  uriMap: Record<string, string>
): string => {
  const $ = cheerio.load(html);
  Object.entries(uriMap).forEach(([uri, replaceWith]) =>
    replaceImageUri($, uri, replaceWith)
  );
  return $.html();
};

export const replaceImageUrisInHtmlBody: ReplaceImageUrisInHtmlBody = (
  html: string,
  uriMap: Record<string, string>
): string => {
  const $ = cheerio.load(replaceImageUrisInHtml(html, uriMap));
  return $('body').html() ?? '';
};
