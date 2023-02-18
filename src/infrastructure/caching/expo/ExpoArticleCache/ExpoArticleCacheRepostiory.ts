import type { WebSQLDatabase, Query } from 'expo-sqlite';
import { makeArticle } from '@/infrastructure/caching/expo/ExpoArticleCache/articleFactory';
import type { Article } from '@/domain/models/Article';
import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';

type ArticleResultRow = {
  id: string;
  title: string;
  body: string;
  section_ids: string;
};

function makeQuery(sql: string, args: (string | number)[] = []): Query {
  return { sql, args };
}

class ExpoArticleCacheRepository {
  db: Promise<WebSQLDatabase>;

  constructor(private sanitizeHtml: SanitizeHtml, database: WebSQLDatabase) {
    this.db = this.prepareDatabase(database);
  }

  async getAllArticles() {
    const query = `
    SELECT
      id,
      title,
      body,
      section_ids
    FROM articles;`;
    const rows = await this.executeSql<ArticleResultRow>(query);
    return rows.map((r) =>
      makeArticle(r.id, r.title, r.body, r.section_ids, this.sanitizeHtml)
    );
  }

  async saveArticles(articles: Article[]) {
    const qValues = new Array(articles.length).fill('(?,?,?,?)').join(',');
    const query = `
    INSERT INTO articles
    VALUES ${qValues};`;
    const data = articles.flatMap((a) => [
      a.id.toString(),
      a.title,
      a.body.html,
      JSON.stringify(Array.from(a.sectionIds)),
    ]);
    await this.executeSql(query, data);
  }

  async deleteAllArticles() {
    await this.executeSql('DELETE FROM articles;');
  }

  private async executeSql<T>(sql: string, args?: (string | number)[]) {
    const db = await this.db;
    const query = makeQuery(sql, args);
    return new Promise<T[]>((s, f) => {
      db.exec([query], false, (err, results) => {
        if (err) return f(err);
        if (!results) return s([]);
        const [result] = results;
        if ('error' in result) return f(result.error);
        return s(result.rows as T[]);
      });
    });
  }

  private async prepareDatabase(db: WebSQLDatabase) {
    const query = makeQuery(`
    CREATE TABLE articles (
      id           TEXT PRIMARY KEY,
      title        TEXT,
      body         TEXT,
      section_ids  TEXT
    );`);
    return new Promise<WebSQLDatabase>((s, f) => {
      db.exec([query], false, (err) => {
        if (err) return f(err);
        return s(db);
      });
    });
  }
}

export { ExpoArticleCacheRepository };
