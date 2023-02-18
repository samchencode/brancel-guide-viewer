import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText/RichText';
import { ExpoArticleCache } from '@/infrastructure/caching/expo/ExpoArticleCache';
import { NodeFileSystem } from '@/infrastructure/file-system/node/NodeFileSystem';
import type { WebSQLDatabase } from 'expo-sqlite';
import { replaceImageUrisInHtmlBody as replaceImageUris } from '@/infrastructure/html-manipulation/cheerio/replaceImageUrisInHtml';
import { getImageUrisFromHtml as getImageUris } from '@/infrastructure/html-manipulation/cheerio/getImageUrisFromHtml';
import { sanitizeHtml } from '@/infrastructure/html-manipulation/sanitize-html/sanitizeHtml';

type DbMock = WebSQLDatabase & {
  exec: jest.Mock;
};

function makeDbMock() {
  return {
    exec: jest.fn(),
  } as unknown as DbMock;
}

describe('ExpoArticleCache', () => {
  jest
    .spyOn(NodeFileSystem.prototype, 'cacheFile')
    .mockImplementation(() => Promise.resolve('example-file.png'));

  const fs = new NodeFileSystem();

  describe('Instantiation', () => {
    it('should be created with a database and filesystem', () => {
      const db = makeDbMock();
      const create = () =>
        new ExpoArticleCache(
          db,
          fs,
          getImageUris,
          replaceImageUris,
          sanitizeHtml
        );
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should create table on instantiation', (done) => {
      const db = makeDbMock();
      db.exec.mockImplementationOnce((_q, _f, cb) => {
        cb();
        done();
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cache = new ExpoArticleCache(
        db,
        fs,
        getImageUris,
        replaceImageUris,
        sanitizeHtml
      );
      expect(db.exec).toBeCalledWith(
        [
          {
            sql: expect.stringContaining('CREATE TABLE articles'),
            args: [],
          },
        ],
        false,
        expect.anything()
      );
    });

    it('should get articles', async () => {
      const db = makeDbMock();
      db.exec.mockImplementationOnce((_q, _f, cb) => cb());
      const cache = new ExpoArticleCache(
        db,
        fs,
        getImageUris,
        replaceImageUris,
        sanitizeHtml
      );
      db.exec.mockImplementationOnce((_q, _f, cb) =>
        cb(null, [
          {
            rows: [
              {
                id: 'id',
                title: 'title',
                body: 'hello',
                section_ids: '["id"]',
              },
            ],
          },
        ])
      );
      const articles = await cache.getAllArticles();
      expect(articles).toHaveLength(1);
      expect(articles[0].body.html).toBe('hello');
    });

    it('should save article to database', async () => {
      const db = makeDbMock();
      db.exec.mockImplementation((_q, _f, cb) => cb());
      const cache = new ExpoArticleCache(
        db,
        fs,
        getImageUris,
        replaceImageUris,
        sanitizeHtml
      );
      db.exec.mockClear();

      const article = new Article(
        new ArticleId('my-article'),
        'My Article Title',
        new RichText(jest.fn(), '<b>Hello World</b>')
      );
      await cache.saveArticles([article, article]);
      expect(db.exec).toBeCalledWith(
        [
          {
            sql: expect.stringContaining('(?,?,?,?),(?,?,?,?);'),
            args: [
              'my-article',
              'My Article Title',
              '<b>Hello World</b>',
              '["my-article"]',
              'my-article',
              'My Article Title',
              '<b>Hello World</b>',
              '["my-article"]',
            ],
          },
        ],
        false,
        expect.anything()
      );
    });

    it('should replace image urls with cached file uri', async () => {
      const db = makeDbMock();
      db.exec.mockImplementation((_q, _f, cb) => cb());
      const cache = new ExpoArticleCache(
        db,
        fs,
        getImageUris,
        replaceImageUris,
        sanitizeHtml
      );
      db.exec.mockClear();

      const article = new Article(
        new ArticleId('my-article'),
        'My Article Title',
        new RichText(jest.fn(), '<img src="hai.png">')
      );
      await cache.saveArticles([article]);
      expect(db.exec).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            args: expect.arrayContaining(['<img src="example-file.png">']),
          }),
        ]),
        false,
        expect.any(Function)
      );
    });
  });
});
