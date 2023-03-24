import { openDatabase } from '@/vendor/websql';
import { WebSqlCacheRepository } from '@/infrastructure/persistence/web-sql/WebSqlCacheRepository/WebSqlCacheRepository';
import {
  TableOfContents,
  TableOfContentsItem,
} from '@/domain/models/TableOfContents';
import {
  About,
  Article,
  ArticleId,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';
import { ArticleToBeCached } from '@/infrastructure/persistence/cache/CacheArticleRepository';

type Query = {
  sql: string;
  args: (number | string)[];
};

const makeQuery = (sql: string, args: (number | string)[]) => ({ sql, args });

const sqlStr = (sql: ReadonlyArray<string>, ...interp: (number | string)[]) =>
  makeQuery(sql.join('?'), interp);

const makeTransaction = (db: Database) =>
  new Promise<SQLTransaction>((s, f) => {
    db.transaction(s, f);
  });

const executeSqlInTransaction = (tx: SQLTransaction, q: Query) =>
  new Promise<SQLResultSet>((s, f) => {
    tx.executeSql(
      q.sql,
      q.args,
      (_tx, res) => s(res),
      (_tx, e) => {
        f(e);
        return true;
      }
    );
  });

async function executeSql(
  db: Database,
  queries: Query[]
): Promise<SQLResultSet[]> {
  const tx = await makeTransaction(db);
  const promises = queries.map((q) => executeSqlInTransaction(tx, q));
  return Promise.all(promises);
}

function resultSetToArray<T>(result: SQLResultSet) {
  const { length } = result.rows;
  return new Array(length)
    .fill(undefined)
    .map((_, i) => result.rows.item(i) as T);
}

describe('WebSqlCacheRepository', () => {
  let db: Database;

  beforeEach(() => {
    db = openDatabase(':memory:', '0.0', '', 1);
  });

  describe('websql', () => {
    it('should print 1', (done) => {
      db.transaction((tx) => {
        tx.executeSql('SELECT 1 AS myCol', [], (_tx, res) => {
          expect(res.rows).toHaveLength(1);
          expect(res.rows.item(0)).toEqual({ myCol: 1 });
          done();
        });
        // eslint-disable-next-line no-console
      }, console.error);
    });
  });

  describe('Instantiation', () => {
    it('should be created with a websql database', () => {
      const create = () => new WebSqlCacheRepository(db);
      expect(create).not.toThrowError();
    });

    it('should create tables on instantiation', async () => {
      const repo = new WebSqlCacheRepository(db);
      await repo.ready;
      const query = sqlStr`SELECT name FROM sqlite_schema WHERE type = 'table'`;
      const [result] = await executeSql(db, [query]);
      expect(result.rows.length).toBe(3);
      const rows = resultSetToArray<{ name: string }>(result);
      expect(rows).toEqual(
        expect.arrayContaining([
          { name: 'articles' },
          { name: 'tableOfContents' },
          { name: 'metadata' },
        ])
      );
    });
  });

  describe('Behavior on Insertion', () => {
    it('should be empty before adding articles and toc', async () => {
      const repo = new WebSqlCacheRepository(db);
      const isEmpty = await repo.isEmpty();
      expect(isEmpty).toBe(true);
    });

    it('should insert table of contents items', async () => {
      const repo = new WebSqlCacheRepository(db);

      const toc = new TableOfContents([
        new TableOfContentsItem('Label1', 'id-string-1'),
        new TableOfContentsItem('Label2', 'id-string-2'),
      ]);

      await repo.saveTableOfContents(toc);

      const [result] = await executeSql(db, [
        sqlStr`SELECT * FROM tableOfContents`,
      ]);
      expect(result.rows.length).toBe(2);
    });

    it('should insert articles', async () => {
      const repo = new WebSqlCacheRepository(db);

      const article = new Article(
        new ArticleId('0'),
        'Example Title',
        new RichText(jest.fn(), 'Example Body'),
        ['ref1', 'ref2']
      );

      const articleToBeCached = new ArticleToBeCached(article, [
        {
          originalUri: 'https://mysite.com/foo.jpg',
          fileUri: '/path/to/file.jpg',
        },
      ]);

      await repo.saveAllArticles([articleToBeCached], new Date(0));

      const [result] = await executeSql(db, [sqlStr`SELECT * FROM articles`]);
      expect(result.rows.length).toBe(1);
      expect(result.rows.item(0)).toEqual({
        id: '0',
        title: 'Example Title',
        body: 'Example Body',
        type: 'base',
        sectionIdsJson: '["ref1","ref2","0"]',
        cachedImagesJson:
          '[{"originalUri":"https://mysite.com/foo.jpg","fileUri":"/path/to/file.jpg"}]',
      });
    });

    it('should set lastUpdatedTimestamp metadata when inserting new articles', async () => {
      const repo = new WebSqlCacheRepository(db);

      const article = new Article(
        new ArticleId('0'),
        'Example Title',
        new RichText(jest.fn(), 'Example Body'),
        ['ref1', 'ref2']
      );

      const articleToBeCached = new ArticleToBeCached(article, [
        {
          originalUri: 'https://mysite.com/foo.jpg',
          fileUri: '/path/to/file.jpg',
        },
      ]);

      await repo.saveAllArticles([articleToBeCached], new Date(0));

      const timestamp = await repo.getLastUpdatedTimestamp();
      expect(timestamp.getTime()).toBe(new Date(0).getTime());
    });

    it('should replace existing articles when saving', async () => {
      const repo = new WebSqlCacheRepository(db);

      const article = new Article(
        new ArticleId('0'),
        'Example Title',
        new RichText(jest.fn(), 'Example Body'),
        ['ref1', 'ref2']
      );

      const articleToBeCached = new ArticleToBeCached(article, [
        {
          originalUri: 'https://mysite.com/foo.jpg',
          fileUri: '/path/to/file.jpg',
        },
      ]);

      await repo.saveAllArticles([articleToBeCached], new Date(0));

      const newArticle = new Article(
        new ArticleId('1'),
        'Other Example Title',
        new RichText(jest.fn(), 'Other Example Body'),
        ['ref1', 'ref3']
      );

      const newArticleToBeCached = new ArticleToBeCached(newArticle, []);

      await repo.saveAllArticles([newArticleToBeCached], new Date(1000));

      const [articleResult] = await executeSql(db, [
        sqlStr`SELECT * FROM articles`,
      ]);
      expect(articleResult.rows).toHaveLength(1);
      expect(articleResult.rows.item(0)).toEqual(
        expect.objectContaining({
          id: '1',
        })
      );

      const lastUpdated = await repo.getLastUpdatedTimestamp();
      expect(lastUpdated.getTime()).toBe(new Date(1000).getTime());
    });

    it('should replace existing table of contents when saving', async () => {
      const repo = new WebSqlCacheRepository(db);

      const toc = new TableOfContents([
        new TableOfContentsItem('Label1', 'id-string-1'),
        new TableOfContentsItem('Label2', 'id-string-2'),
      ]);

      await repo.saveTableOfContents(toc);

      const newToc = new TableOfContents([
        new TableOfContentsItem('Label3', 'id-string-1'),
        new TableOfContentsItem('Label4', 'id-string-2'),
        new TableOfContentsItem('Label5', 'id-string-3'),
      ]);

      await repo.saveTableOfContents(newToc);

      const storedToc = await repo.getTableOfContents();
      expect(storedToc.items).toHaveLength(3);
      expect(storedToc.items[0].label).toBe('Label3');
    });
  });

  describe('Behavior on Retrieval', () => {
    let repo: WebSqlCacheRepository;

    beforeEach(async () => {
      const article = new Article(
        new ArticleId('myId'),
        'MyTitle',
        new RichText(jest.fn(), 'MyBody'),
        ['innerId1', 'innerId2']
      );
      const index = new Index(new RichText(jest.fn(), 'Index'), [
        'A',
        'C',
        'D',
        'E',
      ]);
      const about = new About(new RichText(jest.fn(), 'About this guide'), []);
      const usageInstructions = new UsageInstructions(
        new RichText(jest.fn(), 'How to use this guide'),
        []
      );
      repo = new WebSqlCacheRepository(db);
      await repo.saveAllArticles(
        [
          new ArticleToBeCached(article, [
            { originalUri: '/img.png', fileUri: '/path/to/file.png' },
          ]),
          new ArticleToBeCached(index, []),
          new ArticleToBeCached(about, []),
          new ArticleToBeCached(usageInstructions, []),
        ],
        new Date(0)
      );
    });

    it('should get article by id', async () => {
      const article = await repo.getArticleById(new ArticleId('myId'));
      expect(article.title).toBe('MyTitle');
    });

    it('should get article by section id', async () => {
      const article = await repo.getArticleBySectionId('innerId1');
      expect(article.title).toBe('MyTitle');
    });

    it('should get index section', async () => {
      const index = await repo.getArticleByType('index');
      expect(index.bodyHtml).toBe('Index');
    });

    it('should get about section', async () => {
      const about = await repo.getArticleByType('about');
      expect(about.bodyHtml).toBe('About this guide');
    });

    it('should get usage instructions section', async () => {
      const usageInstructions = await repo.getArticleByType(
        'usage-instructions'
      );
      expect(usageInstructions.bodyHtml).toBe('How to use this guide');
    });
  });
});