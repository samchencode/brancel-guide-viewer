import { cheerio } from '@/vendor/cheerio';
import type { GetImageUrisFromHtml } from '@/domain/models/RichText/htmlManipulationUtils';

function strIsDefined(str: string | undefined): str is string {
  return str !== undefined;
}

export const getImageUrisFromHtml: GetImageUrisFromHtml = (
  html: string
): string[] => {
  const $ = cheerio.load(html);
  return $('img[src]')
    .get()
    .map((e) => $(e).attr('src'))
    .filter(strIsDefined);
};
