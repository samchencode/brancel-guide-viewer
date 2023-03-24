// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: @types/websql isn't a module.
import openDatabaseWebSql from 'websql';

const openDatabase: WindowDatabase['openDatabase'] = openDatabaseWebSql;

export { openDatabase };
