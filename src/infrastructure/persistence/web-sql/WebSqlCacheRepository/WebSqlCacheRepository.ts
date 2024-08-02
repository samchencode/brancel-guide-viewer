import type {
  ArticleId,
  ArticleType,
  SearchableArticle,
} from '@/domain/models/Article';
import {
  TableOfContents,
  TableOfContentsItem,
} from '@/domain/models/TableOfContents';
import type { ArticleToBeCached } from '@/infrastructure/persistence/cache/CacheArticleRepository';
import {
  CachedArticleImage,
  CachedArticle,
} from '@/infrastructure/persistence/cache/CacheArticleRepository';
import { CachedArticleNotFoundError } from '@/infrastructure/persistence/cache/CacheArticleRepository/CachedArticleNotFoundError';
import { CachedArticleSectionNotFoundError } from '@/infrastructure/persistence/cache/CacheArticleRepository/CachedArticleSectionNotFoundError';
import type { CacheRepository } from '@/infrastructure/persistence/cache/CacheRepository';
import type {
  ArticleRow,
  MetadataRow,
  TableOfContentsRow,
} from '@/infrastructure/persistence/web-sql/WebSqlCacheRepository/tableSchemas';

type WebSqlDatabase = Database;

type Query = {
  sql: string;
  args: (number | string)[];
};

const makeQuery = (sql: string, args: (number | string)[]) => ({ sql, args });

const sqlStr = (sql: ReadonlyArray<string>, ...interp: (number | string)[]) =>
  makeQuery(sql.join('?'), interp);

const makeTransaction = (db: WebSqlDatabase) =>
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
  db: WebSqlDatabase,
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

class WebSqlCacheRepository implements CacheRepository {
  ready: Promise<void>;

  constructor(private readonly webSqlDatabase: WebSqlDatabase) {
    this.ready = this.prepareDatabase();
  }

  private async executeSql(queries: Query[]) {
    return executeSql(this.webSqlDatabase, queries);
  }

  private async prepareDatabase() {
    const articlesTable = sqlStr`
    CREATE TABLE IF NOT EXISTS articles (
      id                 TEXT PRIMARY KEY,
      title              TEXT,
      body               TEXT,
      sectionIdsJson     TEXT,
      cachedImagesJson   TEXT,
      type               TEXT
    )`;
    const tableOfContentsTable = sqlStr`
    CREATE TABLE IF NOT EXISTS tableOfContents (
      label       TEXT PRIMARY KEY,
      destination TEXT
    )`;
    const metadataTable = sqlStr`
    CREATE TABLE IF NOT EXISTS metadata (
      lastUpdatedGmtIso TEXT
    )`;
    await executeSql(this.webSqlDatabase, [
      articlesTable,
      tableOfContentsTable,
      metadataTable,
    ]);
  }

  async saveTableOfContents(tableOfContents: TableOfContents): Promise<void> {
    await this.ready;

    const dropToc = sqlStr`DELETE FROM tableOfContents`;
    await this.executeSql([dropToc]);

    const queries = tableOfContents.items.map(
      (i) =>
        sqlStr`INSERT INTO tableOfContents VALUES (${i.label}, ${i.destination})`
    );
    await this.executeSql(queries);
  }

  async getTableOfContents(): Promise<TableOfContents> {
    await this.ready;

    const query = sqlStr`SELECT * FROM tableOfContents`;
    const [result] = await this.executeSql([query]);
    const rows = resultSetToArray<TableOfContentsRow>(result);
    const tocItems = rows.map(
      (row) => new TableOfContentsItem(row.label, row.destination)
    );
    return new TableOfContents(tocItems);
  }

  async getArticleById(id: ArticleId): Promise<CachedArticle> {
    await this.ready;

    const query = sqlStr`SELECT * FROM articles WHERE id = ${id.toString()}`;
    const [result] = await this.executeSql([query]);
    if (result.rows.length === 0) throw new CachedArticleNotFoundError(id);
    const [row] = resultSetToArray<ArticleRow>(result);
    return new CachedArticle(
      row.id,
      row.title,
      row.body,
      row.type,
      row.sectionIdsJson,
      row.cachedImagesJson
    );
  }

  async getArticleBySectionId(sectionId: string): Promise<CachedArticle> {
    await this.ready;

    const query = sqlStr`SELECT * FROM articles WHERE sectionIdsJson LIKE ${`%${sectionId}%`}`;
    const [result] = await this.executeSql([query]);
    if (result.rows.length === 0)
      throw new CachedArticleSectionNotFoundError(sectionId);
    const [row] = resultSetToArray<ArticleRow>(result);
    return new CachedArticle(
      row.id,
      row.title,
      row.body,
      row.type,
      row.sectionIdsJson,
      row.cachedImagesJson
    );
  }

  async getArticleByType(type: ArticleType): Promise<CachedArticle> {
    await this.ready;

    const query = sqlStr`SELECT * FROM articles WHERE type = ${type}`;
    const [result] = await this.executeSql([query]);
    if (result.rows.length === 0) throw new CachedArticleNotFoundError(type);
    const [row] = resultSetToArray<ArticleRow>(result);
    return new CachedArticle(
      row.id,
      row.title,
      row.body,
      row.type,
      row.sectionIdsJson,
      row.cachedImagesJson
    );
  }

  async saveAllArticles(
    articles: ArticleToBeCached[],
    lastUpdatedTimestamp: Date
  ): Promise<void> {
    await this.ready;

    const dropArticles = sqlStr`DELETE FROM articles`;
    const dropMetadata = sqlStr`DELETE FROM metadata`;
    await this.executeSql([dropArticles, dropMetadata]);

    const queries = articles.map(
      (a) => sqlStr`
    INSERT INTO articles VALUES (
      ${a.article.id.toString()},
      ${a.article.title},
      ${a.article.body.html},
      ${JSON.stringify(Array.from(a.article.sectionIds))},
      ${JSON.stringify(a.imagesToBeCached)},
      ${a.article.type}
    )`
    );

    await this.executeSql(queries);
    // The timezone is always zero UTC offset. Has suffix 'Z'
    const timestampIso = lastUpdatedTimestamp.toISOString();
    const metadataQuery = sqlStr`INSERT INTO metadata VALUES (${timestampIso})`;
    await this.executeSql([metadataQuery]);
  }

  async isStale(receivedLastUpdatedTimestamp: Date): Promise<boolean> {
    await this.ready;

    const savedLastUpdatedTimestamp = await this.getLastUpdatedTimestamp();
    return receivedLastUpdatedTimestamp > savedLastUpdatedTimestamp;
  }

  async isEmpty(): Promise<boolean> {
    await this.ready;

    const query = sqlStr`SELECT * FROM metadata`;
    const [result] = await this.executeSql([query]);
    return result.rows.length === 0;
  }

  async updateCachedImagesJson(id: ArticleId, json: string): Promise<void> {
    await this.ready;

    const query = sqlStr`
    UPDATE articles 
    SET cachedImagesJson = ${json} 
    WHERE id = ${id.toString()}`;
    await this.executeSql([query]);
  }

  async getLastUpdatedTimestamp(): Promise<Date> {
    await this.ready;

    const query = sqlStr`SELECT * FROM metadata`;
    const [result] = await this.executeSql([query]);
    const [row] = resultSetToArray<MetadataRow>(result);
    return new Date(row.lastUpdatedGmtIso);
  }

  async delete(): Promise<void> {
    await this.ready;

    const deleteArticles = sqlStr`DROP TABLE articles`;
    const deleteToc = sqlStr`DROP TABLE tableOfContents`;
    const deleteMetadata = sqlStr`DROP TABLE metadata`;
    await this.executeSql([deleteArticles, deleteToc, deleteMetadata]);
    this.ready = this.prepareDatabase();
  }

  async getAllCachedImages(): Promise<CachedArticleImage[]> {
    await this.ready;

    const query = sqlStr`SELECT cachedImagesJson FROM articles`;
    const [result] = await this.executeSql([query]);
    const rows = resultSetToArray<Pick<ArticleRow, 'cachedImagesJson'>>(result);
    return rows
      .flatMap(
        (r) =>
          JSON.parse(r.cachedImagesJson) as {
            originalUri: string;
            fileUri: string;
          }[]
      )
      .flatMap((v) => new CachedArticleImage(v.originalUri, v.fileUri));
  }

  async getAllSearchable(): Promise<SearchableArticle[]> {
    await this.ready;

    const query = sqlStr`SELECT
      id,
      title,
      body
    FROM articles`;

    const [result] = await this.executeSql([query]);
    return resultSetToArray<SearchableArticle>(result);
  }

  static $inject = ['webSqlDatabase'];
}

export { WebSqlCacheRepository };
