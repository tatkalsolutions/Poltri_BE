"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__databaseConfig_USER = exports.__databaseConfig_ERP = exports.getPool = void 0;
const mssql_1 = require("mssql");
const sql = require("mssql");
const config_db_1 = require("./config.db");
const mysql = require("mysql2/promise");
const config_config_1 = require("../config/config.config");
let pool;
const getPool = async () => {
    if (!pool) {
        if (config_config_1.__DATABASE_TYPE == "MSSQL") {
            pool = await sql.connect(config_db_1.__MSSQL_dbConfig_ERP);
        }
        else if (config_config_1.__DATABASE_TYPE == "MYSQL") {
            pool = mysql.createPool(config_db_1.__MYSQL_dbConfig_ERP);
        }
    }
    return pool;
};
exports.getPool = getPool;
exports.__databaseConfig_ERP = new mssql_1.ConnectionPool(config_db_1.__MSSQL_dbConfig_ERP);
exports.__databaseConfig_USER = new mssql_1.ConnectionPool(config_db_1.__MSSQL_dbConfig_USER);
//# sourceMappingURL=connection_pool.db..js.map