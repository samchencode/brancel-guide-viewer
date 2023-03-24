import type { ArticleRepository } from '@/domain/models/Article';
import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import { NodeFileSystem } from '@/infrastructure/file-system/node/NodeFileSystem';
import { getImageUrisFromHtml } from '@/infrastructure/html-manipulation/cheerio/getImageUrisFromHtml';
import { replaceImageUrisInHtmlBody } from '@/infrastructure/html-manipulation/cheerio/replaceImageUrisInHtml';
import { sanitizeHtml } from '@/infrastructure/html-manipulation/sanitize-html/sanitizeHtml';
import {
  ArticleToBeCached,
  CacheArticleRepository,
  CachedArticle,
} from '@/infrastructure/persistence/cache/CacheArticleRepository';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';
import { WebSqlCacheRepository } from '@/infrastructure/persistence/web-sql/WebSqlCacheRepository/WebSqlCacheRepository';
import { openDatabase } from '@/vendor/websql';

const wait = (ms: number) =>
  new Promise((s) => {
    setTimeout(s, ms);
  });

describe('CacheArticleRepository', () => {
  let db: Database;
  let fs: FileSystem;
  let articleRepository: ArticleRepository;

  describe('Instantiation', () => {
    beforeEach(() => {
      db = openDatabase(':memory:', '0.0', '', 1);
      fs = new NodeFileSystem();
      articleRepository = new FakeArticleRepository();
    });

    it('should be created with dependencies', () => {
      const cacheRepository = new WebSqlCacheRepository(db);

      const create = () =>
        new CacheArticleRepository(
          articleRepository,
          cacheRepository,
          fs,
          getImageUrisFromHtml,
          replaceImageUrisInHtmlBody,
          sanitizeHtml
        );

      expect(create).not.toThrowError();
    });
  });

  describe('Behavior when cache empty', () => {
    let cacheRepository: WebSqlCacheRepository;

    beforeEach(() => {
      db = openDatabase(':memory:', '0.0', '', 1);
      fs = new NodeFileSystem();
      cacheRepository = new WebSqlCacheRepository(db);
      articleRepository = new FakeArticleRepository();
      jest.spyOn(articleRepository, 'getAll');
      jest.spyOn(articleRepository, 'getById');
      jest.spyOn(cacheRepository, 'saveAllArticles');
    });

    it('should get from normal repo if cache empty', async () => {
      const article = new Article(
        new ArticleId('MyId'),
        'MyTitle',
        new RichText(sanitizeHtml, 'MyBody'),
        []
      );

      jest.mocked(articleRepository.getById).mockResolvedValue(article);

      const cacheArticleRepository = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      const result = await cacheArticleRepository.getById(
        new ArticleId('MyId')
      );
      expect(result.id.toString()).toBe('MyId');
      expect(result.body.html).toBe('MyBody');
    });

    it('should save all articles from normal repo if cache empty', async () => {
      const article = new Article(
        new ArticleId('MyId'),
        'MyTitle',
        new RichText(sanitizeHtml, 'MyBody'),
        []
      );

      const getAll = jest
        .mocked(articleRepository.getAll)
        .mockResolvedValue([article]);
      const saveAll = jest.mocked(cacheRepository.saveAllArticles);

      const repo = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      await repo.cachingArticles;

      expect(getAll).toBeCalledTimes(1);
      expect(saveAll).toBeCalledTimes(1);
    });
  });

  describe('Behavior when cache populated', () => {
    let cacheRepository: WebSqlCacheRepository;

    beforeEach(async () => {
      db = openDatabase(':memory:', '0.0', '', 1);
      fs = new NodeFileSystem();
      cacheRepository = new WebSqlCacheRepository(db);
      articleRepository = new FakeArticleRepository();
      jest.spyOn(articleRepository, 'getAll');
      jest.spyOn(articleRepository, 'getById');

      const repoArticle1 = new Article(
        new ArticleId('first'),
        'ArticleOneFromRepo',
        new RichText(sanitizeHtml, 'BodyOne'),
        ['foo', 'bar']
      );
      const repoArticle2 = new Article(
        new ArticleId('second'),
        'ArticleTwoFromRepo',
        new RichText(sanitizeHtml, 'BodyTwo'),
        ['baz']
      );

      jest
        .mocked(articleRepository.getAll)
        .mockResolvedValue([repoArticle1, repoArticle2]);

      const cacheArticle1 = new Article(
        new ArticleId('first'),
        'ArticleOneFromCache',
        new RichText(sanitizeHtml, 'BodyOne'),
        ['foo', 'bar']
      );

      const cacheArticle2 = new Article(
        new ArticleId('second'),
        'ArticleTwoFromCache',
        new RichText(sanitizeHtml, 'BodyTwo'),
        ['baz']
      );

      await cacheRepository.saveAllArticles(
        [
          new ArticleToBeCached(cacheArticle1, []),
          new ArticleToBeCached(cacheArticle2, []),
        ],
        new Date(0)
      );

      jest.spyOn(cacheRepository, 'saveAllArticles');
      jest.spyOn(cacheRepository, 'getArticleById');
      jest.spyOn(articleRepository, 'getLastUpdatedTimestamp');
    });

    it('should get from cache repo if repo rejects', async () => {
      jest
        .mocked(articleRepository.getById)
        .mockImplementation(() => Promise.reject());

      const cacheArticleRepository = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      const result = await cacheArticleRepository.getById(
        new ArticleId('first')
      );

      expect(result.title).toBe('ArticleOneFromCache');
    });

    it('should get from cache repo if it returns first', async () => {
      jest.useFakeTimers({ advanceTimers: true });

      const repoArticle1 = new Article(
        new ArticleId('first'),
        'ArticleOneFromRepo',
        new RichText(sanitizeHtml, 'BodyOne'),
        ['foo', 'bar']
      );

      jest
        .mocked(articleRepository.getById)
        .mockResolvedValue(wait(300).then(() => repoArticle1));

      const cacheArticleRepository = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      const result = await cacheArticleRepository.getById(
        new ArticleId('first')
      );

      jest.runAllTimers();

      expect(result.title).toBe('ArticleOneFromCache');
    });

    it('should get from repo if it returns first', async () => {
      jest.useFakeTimers({ advanceTimers: true });

      const repoArticle1 = new Article(
        new ArticleId('first'),
        'ArticleOneFromRepo',
        new RichText(sanitizeHtml, 'BodyOne'),
        ['foo', 'bar']
      );

      jest.mocked(articleRepository.getById).mockResolvedValue(repoArticle1);

      const cacheArticle1 = new CachedArticle(
        'first',
        'ArticleOneFromCache',
        'BodyOne',
        'base',
        '["foo","bar"]',
        '[]'
      );

      jest
        .mocked(cacheRepository.getArticleById)
        .mockResolvedValue(wait(300).then(() => cacheArticle1));

      const cacheArticleRepository = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      const result = await cacheArticleRepository.getById(
        new ArticleId('first')
      );

      jest.runAllTimers();

      expect(result.title).toBe('ArticleOneFromRepo');
    });

    it('should save results from normal repo if cache stale', async () => {
      jest.useFakeTimers({ advanceTimers: true });

      jest
        .mocked(articleRepository.getLastUpdatedTimestamp)
        .mockResolvedValue(new Date(1000));

      const saveAll = jest.mocked(cacheRepository.saveAllArticles);

      const cacheArticleRepository = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      await cacheArticleRepository.cachingArticles;

      expect(saveAll).toBeCalledTimes(1);

      const lastUpdated =
        await cacheArticleRepository.getLastUpdatedTimestamp();
      const expected = new Date(1000);
      expect(lastUpdated.getTime()).toBe(expected.getTime());
    });
  });

  describe('Behavior with images and empty cache', () => {
    let cacheRepository: WebSqlCacheRepository;

    beforeEach(async () => {
      db = openDatabase(':memory:', '0.0', '', 1);
      fs = {
        cacheFile: jest.fn(),
        getAssetAsString: jest.fn(),
        readFileAsString: jest.fn(),
        checkFileExists: jest.fn(),
      };
      cacheRepository = new WebSqlCacheRepository(db);
      articleRepository = new FakeArticleRepository();

      jest.spyOn(articleRepository, 'getAll');

      const repoArticle1 = new Article(
        new ArticleId('first'),
        'ArticleOneFromRepo',
        new RichText(
          sanitizeHtml,
          'Foo <img src="https://example.com/foo.png">'
        ),
        ['foo', 'bar']
      );

      const repoArticle2 = new Article(
        new ArticleId('second'),
        'ArticleTwoFromRepo',
        new RichText(
          sanitizeHtml,
          'Bar <img src="https://example.com/bar.png">'
        ),
        ['baz']
      );

      jest
        .mocked(articleRepository.getAll)
        .mockResolvedValue([repoArticle1, repoArticle2]);

      jest.mocked(fs.cacheFile).mockImplementation(async (uri) => {
        if (uri === 'https://example.com/foo.png') return '/path/to/myFoo.png';
        if (uri === 'https://example.com/bar.png') return '/path/to/myBar.png';
        throw Error('not implemented');
      });
    });

    it('should save images and save file location to cache database', async () => {
      const cacheFile = jest.mocked(fs.cacheFile);

      const cacheArticleRepository = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      await cacheArticleRepository.cachingArticles;

      expect(cacheFile).toBeCalledTimes(2);

      const articleOne = await cacheRepository.getArticleById(
        new ArticleId('first')
      );

      expect(articleOne.cachedImages).toHaveLength(1);
      expect(articleOne.cachedImages[0]).toEqual({
        originalUri: 'https://example.com/foo.png',
        fileUri: '/path/to/myFoo.png',
      });

      const articleTwo = await cacheRepository.getArticleById(
        new ArticleId('second')
      );

      expect(articleTwo.cachedImages).toHaveLength(1);
      expect(articleTwo.cachedImages[0]).toEqual({
        originalUri: 'https://example.com/bar.png',
        fileUri: '/path/to/myBar.png',
      });
    });
  });

  describe('Behavior with cached images', () => {
    let cacheRepository: WebSqlCacheRepository;

    beforeEach(async () => {
      db = openDatabase(':memory:', '0.0', '', 1);
      fs = {
        cacheFile: jest.fn(),
        getAssetAsString: jest.fn(),
        readFileAsString: jest.fn(),
        checkFileExists: jest.fn(),
      };
      cacheRepository = new WebSqlCacheRepository(db);
      articleRepository = new FakeArticleRepository();
      jest.spyOn(articleRepository, 'getById');

      const cacheArticle1 = new Article(
        new ArticleId('first'),
        'ArticleOneFromCache',
        new RichText(
          sanitizeHtml,
          'Foo <img src="https://example.com/foo.png">'
        ),
        ['foo', 'bar']
      );

      const cacheArticle2 = new Article(
        new ArticleId('second'),
        'ArticleTwoFromCache',
        new RichText(
          sanitizeHtml,
          'Bar <img src="https://example.com/bar.png">'
        ),
        ['baz']
      );

      await cacheRepository.saveAllArticles(
        [
          new ArticleToBeCached(cacheArticle1, [
            {
              originalUri: 'https://example.com/foo.png',
              fileUri: '/path/to/foo.png',
            },
          ]),
          new ArticleToBeCached(cacheArticle2, [
            {
              originalUri: 'https://example.com/bar.png',
              fileUri: '/path/to/bar.png',
            },
          ]),
        ],
        new Date(0)
      );
    });

    it('should replace images with base64 if getting from cache', async () => {
      jest.mocked(fs.checkFileExists).mockResolvedValue(true);
      jest.mocked(fs.readFileAsString).mockResolvedValue('[b64String]');

      const cacheArticleRepository = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      const result = await cacheArticleRepository.getById(
        new ArticleId('first')
      );
      expect(result.body.html).toBe(
        'Foo <img src="data:image/png;base64,[b64String]">'
      );
    });

    it('should use original uri if image is missing', async () => {
      jest.mocked(fs.checkFileExists).mockResolvedValue(false);
      jest.mocked(fs.cacheFile).mockResolvedValue('/path/to/foo.png');
      const cacheArticleRepository = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      const result = await cacheArticleRepository.getById(
        new ArticleId('first')
      );
      expect(result.body.html).toBe(
        'Foo <img src="https://example.com/foo.png">'
      );
    });

    it('should refetch image if missing and update fileUri in cache database', async () => {
      jest.mocked(fs.checkFileExists).mockResolvedValue(false);
      const cacheFile = jest
        .mocked(fs.cacheFile)
        .mockResolvedValue('/path/to/foo.png');
      const cacheArticleRepository = new CacheArticleRepository(
        articleRepository,
        cacheRepository,
        fs,
        getImageUrisFromHtml,
        replaceImageUrisInHtmlBody,
        sanitizeHtml
      );

      await cacheArticleRepository.getById(new ArticleId('first'));

      expect(cacheFile).toBeCalledTimes(1);
    });
  });
});
