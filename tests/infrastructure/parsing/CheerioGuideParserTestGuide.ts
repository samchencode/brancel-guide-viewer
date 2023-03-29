import path from 'path';
import fs from 'fs';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import { cheerio } from '@/vendor/cheerio';
import { ArticleId } from '@/domain/models/Article';

const guidePathArg = process.argv
  .find((str) => str.match(/^--guide-path=/))
  ?.replace('--guide-path=', '');
if (!guidePathArg)
  throw Error('Need Guide Path Arg `--guide-path=<path to guide>`');
const guidePath = path.resolve(process.cwd(), guidePathArg);
if (!fs.existsSync(guidePath))
  throw Error(`Cannot find guide file at '${guidePath}'`);

const guideText = fs.readFileSync(guidePath, 'utf-8');

describe('Guide Parsability Test', () => {
  it('should create a guide parser', () => {
    const create = () => new CheerioGuideParser();
    expect(create).not.toThrowError();
  });

  it('should parse the INDEX', async () => {
    const parser = new CheerioGuideParser();
    const index = await parser.getIndex(guideText);

    expect(index.body.html).not.toBe('');
    expect(index.body.html).toContain('<a name="A">');
  });

  it('should parse the about section', async () => {
    const parser = new CheerioGuideParser();
    const about = await parser.getAbout(guideText);

    expect(about.body.html).not.toBe('');
  });

  it('should parse the guide navigation instructions', async () => {
    const parser = new CheerioGuideParser();
    const instructions = await parser.getUsageInstructions(guideText);

    expect(instructions.body.html).not.toBe('');
  });

  it('should retrieve articles other than the index, about, and nav instructions', async () => {
    const parser = new CheerioGuideParser();
    const articles = await parser.getArticles(guideText);
    expect(articles).not.toHaveLength(0);
    articles.forEach((a) => {
      expect(a.body.html.length, `Testing: ${a.id}`).toBeGreaterThan(50);
    });
  });

  it('should retrieve each article found in the table of contents', async () => {
    const $ = cheerio.load(guideText);
    const tocHrefs = $('ul a.index[href^="#"]')
      .filter((_, el) => $(el).text() !== '')
      .filter(
        (_, el) =>
          !['#INDEX', '#TABLE_OF_CONTENTS'].includes($(el).attr('href') ?? '')
      )
      .map((_, el) => $(el).attr('href')?.slice(1))
      .get();

    expect(tocHrefs).not.toHaveLength(0);
    expect(tocHrefs).toEqual(expect.arrayContaining([expect.any(String)]));

    const parser = new CheerioGuideParser();
    const articles = await parser.getArticles(guideText);

    for (const href of tocHrefs) {
      const article = articles.find((a) => a.id.is(new ArticleId(href)));
      const articleWithSubsection = articles.find((a) => a.hasSection(href));

      expect(article || articleWithSubsection, `Testing: ${href}`).toBeTruthy();
    }
  });

  it('should retrieve every anchor href on the page', async () => {
    const IGNORE_IDS = [
      'TABLE_OF_CONTENTS',
      'about',
      'Guideline_Navigation_Instructions',
      'Top_of_guideline',
      'TIP',
      'ORTHOPEDIC_TRAUMA',
      'URGENT_CARE_FOR_ALL',
      'URGENT_CARE_MEDICINE',
    ];

    const $ = cheerio.load(guideText);
    const ids = $('a[href]')
      .map((_, el) => $(el).attr('href'))
      .filter((_, href) => /^#/.test(href))
      .map((_, href) => href.slice(1))
      .filter((_, id) => !IGNORE_IDS.includes(id))
      .get();

    const uniqIds = Array.from(new Set(ids));

    expect(uniqIds).not.toHaveLength(0);
    expect(uniqIds).toEqual(expect.arrayContaining([expect.any(String)]));

    const parser = new CheerioGuideParser();
    const articles = [
      ...(await parser.getArticles(guideText)),
      await parser.getIndex(guideText),
    ];

    for (const id of uniqIds) {
      const article = articles.find((a) => a.id.is(new ArticleId(id)));
      const articleWithSubsection = articles.find((a) => a.hasSection(id));

      expect(article || articleWithSubsection, `Testing: ${id}`).toBeTruthy();
    }
  });
});
