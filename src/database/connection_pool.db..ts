import { ConnectionPool } from 'mssql';
import * as sql from "mssql";
import { __MSSQL_dbConfig_ERP, __MSSQL_dbConfig_USER, __MYSQL_dbConfig_ERP } from './config.db';
// import mysql from 'mysql2/promise';
import * as mysql from 'mysql2/promise';
import { __DATABASE_TYPE } from 'src/config/config.config';

// let pool: sql.ConnectionPool;
let pool: any;

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (!pool) {
    if (__DATABASE_TYPE == "MSSQL") {
      pool = await sql.connect(__MSSQL_dbConfig_ERP);
    } else if (__DATABASE_TYPE == "MYSQL") {
      pool = mysql.createPool(__MYSQL_dbConfig_ERP);
    }
  }
  return pool;
};

export const __databaseConfig_ERP: ConnectionPool = new ConnectionPool(__MSSQL_dbConfig_ERP);
export const __databaseConfig_USER: ConnectionPool = new ConnectionPool(__MSSQL_dbConfig_USER);