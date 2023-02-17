import { cheerio } from '@/vendor/cheerio';
import type { ReplaceImageUrisInHtmlBody } from '@/infrastructure/util/types';

function replaceImageUri(
  $: cheerio.CheerioAPI,
  uri: string,
  replaceWith: string
) {
  $(`img[src="${uri}"]`).each((_, e) => {
    $(e).attr('src', replaceWith);
  });
}

export const replaceImageUrisInHtmlBody: ReplaceImageUrisInHtmlBody = (
  html: string,
  uriMap: Record<string, string>
): string => {
  const $ = cheerio.load(html);
  Object.entries(uriMap).forEach(([uri, replaceWith]) =>
    replaceImageUri($, uri, replaceWith)
  );
  return $('body').html() ?? '';
};
