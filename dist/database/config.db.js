"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__MYSQL_dbConfig_ERP = exports.__MSSQL_dbConfig_USER = exports.__MSSQL_dbConfig_ERP = void 0;
const config_config_1 = require("../config/config.config");
exports.__MSSQL_dbConfig_ERP = {
    server: config_config_1.__MSSQL_DB_SERVER,
    port: config_config_1.__MSSQL_DB_PORT,
    user: config_config_1.__MSSQL_DB_USER,
    password: config_config_1.__MSSQL_DB_PASSWORD,
    database: config_config_1.__MSSQL_DATABASE_MAIN,
    requestTimeout: 800000,
    pool: {
        max: 100,
        min: 5,
        idleTimeoutMillis: 800000,
    },
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true,
        connectionTimeout: 15000,
        requestTimeout: 800000,
    },
};
exports.__MSSQL_dbConfig_USER = {
    server: config_config_1.__MSSQL_DB_SERVER,
    port: config_config_1.__MSSQL_DB_PORT,
    user: config_config_1.__MSSQL_DB_USER,
    password: config_config_1.__MSSQL_DB_PASSWORD,
    database: config_config_1.__MSSQL_DATABASE_USER,
    requestTimeout: 800000,
    pool: {
        max: 100,
        min: 5,
        idleTimeoutMillis: 800000,
    },
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true,
        connectionTimeout: 15000,
        requestTimeout: 800000,
    },
};
exports.__MYSQL_dbConfig_ERP = {
    host: config_config_1.__MYSQL_DB_SERVER,
    port: config_config_1.__MYSQL_DB_PORT,
    user: config_config_1.__MYSQL_DB_USER,
    password: config_config_1.__MYSQL_DB_PASSWORD,
    database: config_config_1.__MYSQL_DATABASE_MAIN,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
    connectTimeout: 15000,
};
//# sourceMappingURL=config.db.js.map