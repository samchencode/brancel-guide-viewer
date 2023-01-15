import { cheerio } from '@/vendor/cheerio';

function strIsDefined(str: string | undefined): str is string {
  return str !== undefined;
}

export function getImageUris(html: string) {
  const $ = cheerio.load(html);
  return $('img')
    .get()
    .map((e) => $(e).attr('src'))
    .filter(strIsDefined);
}
