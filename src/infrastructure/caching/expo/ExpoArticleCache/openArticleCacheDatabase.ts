import { openDatabase as openExpoSqliteDatabase } from 'expo-sqlite';
import type { WebSQLDatabase } from 'expo-sqlite';

const DATABASE_NAME = 'expo-article-cache-v1.db';

export function openArticleCacheDatabase(): WebSQLDatabase {
  return openExpoSqliteDatabase(DATABASE_NAME);
}
