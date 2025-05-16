import * as sql from "mssql";
import { __MSSQL_DATABASE_MAIN, __MSSQL_DATABASE_USER, __MSSQL_DB_PASSWORD, __MSSQL_DB_PORT, __MSSQL_DB_SERVER, __MSSQL_DB_USER, __MYSQL_DATABASE_MAIN, __MYSQL_DB_PASSWORD, __MYSQL_DB_PORT, __MYSQL_DB_SERVER, __MYSQL_DB_USER } from "src/config/config.config";
export const __MSSQL_dbConfig_ERP: sql.config = {
  server: __MSSQL_DB_SERVER,
  port: __MSSQL_DB_PORT,
  user: __MSSQL_DB_USER,
  password: __MSSQL_DB_PASSWORD,
  database: __MSSQL_DATABASE_MAIN,
  requestTimeout: 800000, // 10 minutes timeout
  pool: {
    max: 100, // Maximum number of connections in the pool
    min: 5,   // Keep at least 5 connections open
    idleTimeoutMillis: 800000,
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    connectionTimeout: 15000, // 15 seconds timeout for connection establishment
    requestTimeout: 800000, // 5 minutes timeout for queries
  },
};

export const __MSSQL_dbConfig_USER: sql.config = {
  server: __MSSQL_DB_SERVER,
  port: __MSSQL_DB_PORT,
  user: __MSSQL_DB_USER,
  password: __MSSQL_DB_PASSWORD,
  database: __MSSQL_DATABASE_USER,
  requestTimeout: 800000, // 10 minutes timeout
  pool: {
    max: 100, // Maximum number of connections in the pool
    min: 5,   // Keep at least 5 connections open
    idleTimeoutMillis: 800000,
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    connectionTimeout: 15000, // 15 seconds timeout for connection establishment
    requestTimeout: 800000, // 5 minutes timeout for queries
  },
};



export const __MYSQL_dbConfig_ERP = {
  host: __MYSQL_DB_SERVER,
  port: __MYSQL_DB_PORT,
  user: __MYSQL_DB_USER,
  password: __MYSQL_DB_PASSWORD,
  database: __MYSQL_DATABASE_MAIN,
  waitForConnections: true,
  connectionLimit: 100, // Maximum number of connections in the pool
  queueLimit: 0,
  connectTimeout: 15000, // 15 seconds timeout for connection establishment
};
