import type { SQLError } from 'expo-sqlite';

declare module 'expo-sqlite' {
  export interface SQLTransaction {
    executeSql<T>(
      sqlStatement: string,
      args?: (number | string)[],
      callback?: SQLStatementCallback<T>,
      errorCallback?: SQLStatementErrorCallback
    ): void;
  }

  export type SQLStatementErrorCallback = (
    transaction: SQLTransaction,
    error: SQLError
  ) => void;

  export type SQLStatementCallback<T> = (
    transaction: SQLTransaction,
    resultSet: SQLResultSet<T>
  ) => void;

  export type SQLResultSet<T> = {
    insertId?: number;
    rowsAffected: number;
    rows: SQLResultSetRowList<T>;
  };

  export interface SQLResultSetRowList<T> {
    length: number;
    item(index: number): T;
    _array: T[];
  }
}
