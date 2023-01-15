import { cheerio } from '@/vendor/cheerio';

function replaceImageUri(
  $: cheerio.CheerioAPI,
  uri: string,
  replaceWith: string
) {
  $(`img[src="${uri}"]`).each((_, e) => {
    $(e).attr('src', replaceWith);
  });
}

function replaceImageUris(html: string, uriMap: Record<string, string>) {
  const $ = cheerio.load(html);
  Object.entries(uriMap).forEach(([uri, replaceWith]) =>
    replaceImageUri($, uri, replaceWith)
  );
  return $('body').html();
}

export { replaceImageUris };
