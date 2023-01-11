import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';

function removeTopOfGuidelineLinks($: cheerio.CheerioAPI) {
  $('a[href="#Top_of_guideline"]').each((_, node) => {
    if (node.prev?.nodeType === constants.NODES.TEXT_NODE)
      $(node.prev).remove();
    $(node).remove();
  });
}

function removeHr($: cheerio.CheerioAPI) {
  $('hr').remove();
}

const preparationTasks = [removeTopOfGuidelineLinks, removeHr];

export function prepare($: cheerio.CheerioAPI) {
  preparationTasks.forEach((t) => t($));
}
