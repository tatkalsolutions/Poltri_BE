import { ConnectionPool } from 'mssql';
import * as sql from "mssql";
export declare const getPool: () => Promise<sql.ConnectionPool>;
export declare const __databaseConfig_ERP: ConnectionPool;
export declare const __databaseConfig_USER: ConnectionPool;
