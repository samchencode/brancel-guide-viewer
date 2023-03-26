import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';
import {
  TableOfContents,
  TableOfContentsItem,
} from '@/domain/models/TableOfContents';
import { ArticleToBeCached } from '@/infrastructure/persistence/cache/CacheArticleRepository';
import { CacheTableOfContentsRepository } from '@/infrastructure/persistence/cache/CacheTableOfContentsRepository/CacheTableOfContentsRepository';
import { StubTableOfContentsRepository } from '@/infrastructure/persistence/fake/StubTableOfContentsRepository';
import { WebSqlCacheRepository } from '@/infrastructure/persistence/web-sql/WebSqlCacheRepository/WebSqlCacheRepository';
import { openDatabase } from '@/vendor/websql';

describe('CacheTableOfContentsRepository', () => {
  let db: Database;

  beforeEach(() => {
    db = openDatabase(':memory:', '0.0', '', 1);
  });

  describe('Instantiation', () => {
    it('should create cache with a repository', () => {
      const tableOfContentsRepository = new StubTableOfContentsRepository();
      const cacheRepository = new WebSqlCacheRepository(db);

      const create = () =>
        new CacheTableOfContentsRepository(
          tableOfContentsRepository,
          cacheRepository
        );

      expect(create).not.toThrowError();
    });
  });

  describe('Behavior when cache empty', () => {
    let tableOfContentsRepository: StubTableOfContentsRepository;
    let cacheRepository: WebSqlCacheRepository;

    beforeEach(() => {
      tableOfContentsRepository = new StubTableOfContentsRepository();
      jest.spyOn(tableOfContentsRepository, 'get');

      cacheRepository = new WebSqlCacheRepository(db);
      jest.spyOn(cacheRepository, 'saveTableOfContents');
    });

    it('should get from source repo if cache empty', async () => {
      const cache = new CacheTableOfContentsRepository(
        tableOfContentsRepository,
        cacheRepository
      );

      const sourceGet = jest.mocked(tableOfContentsRepository.get);

      const result = await cache.get();

      expect(sourceGet).toHaveBeenCalled(); // NOTE: this is also called on instantiation to cache TOC

      expect(result.items).toHaveLength(4);
      expect(result.items[0].label).toBe('Resurrection, A');
      expect(result.items[1].label).toBe('Radioactive Dreams');
    });

    it('should save data from source repo to cache if cache empty', async () => {
      const cache = new CacheTableOfContentsRepository(
        tableOfContentsRepository,
        cacheRepository
      );

      const saveToCache = jest.mocked(cacheRepository.saveTableOfContents);

      await cache.cachingTableOfContents;

      expect(saveToCache).toHaveBeenCalledTimes(1);

      const cached = await cacheRepository.getTableOfContents();
      expect(cached.items).toHaveLength(4);
      expect(cached.items[0].label).toBe('Resurrection, A');
    });
  });

  describe('Behavior when cache populated', () => {
    let tableOfContentsRepository: StubTableOfContentsRepository;
    let cacheRepository: WebSqlCacheRepository;

    const wait = (ms: number) =>
      new Promise((s) => {
        setTimeout(s, ms);
      });

    beforeEach(async () => {
      tableOfContentsRepository = new StubTableOfContentsRepository();
      jest.spyOn(tableOfContentsRepository, 'get');

      cacheRepository = new WebSqlCacheRepository(db);

      await cacheRepository.saveTableOfContents(
        new TableOfContents([
          new TableOfContentsItem('Cached Prologue', 'prologue'),
          new TableOfContentsItem('Cached Info', 'info'),
        ])
      );

      await cacheRepository.saveAllArticles(
        [
          new ArticleToBeCached(
            new Article(
              new ArticleId('prologue'),
              'Cached Prologue',
              new RichText(jest.fn(), 'Hello World'),
              []
            ),
            []
          ),
        ],
        new Date(0)
      );

      jest.spyOn(cacheRepository, 'saveTableOfContents');
      jest.spyOn(cacheRepository, 'getTableOfContents');
    });

    it('should get from cache repo if source repo rejects', async () => {
      jest.mocked(tableOfContentsRepository.get).mockRejectedValue(new Error());

      const cache = new CacheTableOfContentsRepository(
        tableOfContentsRepository,
        cacheRepository
      );

      const result = await cache.get();
      expect(result.items).toHaveLength(2);
      expect(result.items[0].label).toBe('Cached Prologue');
      expect(result.items[1].label).toBe('Cached Info');
    });

    it('should get from cache repo if it returns first', async () => {
      jest
        .mocked(tableOfContentsRepository.get)
        .mockResolvedValue(wait(500).then(() => new TableOfContents([])));

      const cache = new CacheTableOfContentsRepository(
        tableOfContentsRepository,
        cacheRepository
      );

      const result = await cache.get();

      expect(result.items).toHaveLength(2);
      expect(result.items[0].label).toBe('Cached Prologue');
      expect(result.items[1].label).toBe('Cached Info');
    });

    it('should get from source repo if it returns first', async () => {
      jest
        .mocked(cacheRepository.getTableOfContents)
        .mockResolvedValue(wait(1000).then(() => new TableOfContents([])));

      const cache = new CacheTableOfContentsRepository(
        tableOfContentsRepository,
        cacheRepository
      );

      const result = await cache.get();
      expect(result.items).toHaveLength(4);

      expect(result.items[0].label).toBe('Resurrection, A');
      expect(result.items[1].label).toBe('Radioactive Dreams');
      expect(result.items[2].label).toBe('Death by China ');
      expect(result.items[3].label).toBe('Pont du Nord, Le');
    });
  });
});
