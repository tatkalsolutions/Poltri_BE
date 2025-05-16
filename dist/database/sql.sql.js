"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQL = void 0;
const common_1 = require("@nestjs/common");
const config_config_1 = require("../config/config.config");
const connection_pool_db_1 = require("./connection_pool.db.");
class SQL {
    async insertData(data) {
        const dataset = await this.createObjectInsert(data.tableName, data);
        const fieldNames = dataset.field.join(', ');
        const values = dataset.value.join(', ');
        const query = `INSERT INTO ${dataset.table} (${fieldNames}) VALUES (${values})`;
        console.log(query);
        return query;
    }
    async insertUserData(data) {
        const dataset = await this.createObjectInsertUser(data.tableName, data);
        const fieldNames = dataset.field.join(', ');
        const values = dataset.value.join(', ');
        const query = `INSERT INTO ${dataset.table} (${fieldNames}) VALUES (${values})`;
        return this.executeUserQuery(query);
    }
    async createObjectInsert(tableName, data) {
        const returnObj = {};
        const fieldArray = [];
        const valueArray = [];
        const datatype = [];
        returnObj['table'] = tableName;
        const query = `  SELECT 
    COLUMN_NAME, 
    DATA_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = '${tableName}';`;
        const result = await this.executeQuery(query, []);
        for (const item of result) {
            datatype.push(JSON.parse(JSON.stringify(item)));
        }
        Object.keys(data).forEach((ele) => {
            if (data[ele] == 0) {
                data[ele] = data[ele].toString();
            }
            if (data[ele] != '' &&
                data[ele] != null &&
                data[ele] != undefined &&
                typeof (data[ele]) != 'object') {
                const filterObj = datatype.filter((eles) => eles.COLUMN_NAME === ele);
                if (filterObj.length != 0) {
                    if (filterObj[0].DATA_TYPE == 'nvarchar' || filterObj[0].DATA_TYPE == 'varchar' || filterObj[0].DATA_TYPE == 'string' || filterObj[0].DATA_TYPE == 'char') {
                        fieldArray.push(ele);
                        valueArray.push(`N'${data[ele]}'`);
                    }
                    else if (filterObj[0].DATA_TYPE == 'bigint' || filterObj[0].DATA_TYPE == 'int' || filterObj[0].DATA_TYPE == 'numeric' || filterObj[0].DATA_TYPE == 'nchar' || filterObj[0].DATA_TYPE == 'number' || filterObj[0].DATA_TYPE == 'decimal') {
                        fieldArray.push(ele);
                        valueArray.push(data[ele]);
                    }
                    else if (filterObj[0].DATA_TYPE === 'bit' && typeof data[ele] == 'boolean') {
                        fieldArray.push(ele);
                        valueArray.push(data[ele] ? '1' : '0');
                    }
                    else if (filterObj[0].DATA_TYPE === 'date') {
                        fieldArray.push(ele);
                        valueArray.push(`'${data[ele]}'`);
                    }
                    else {
                        fieldArray.push(ele);
                        valueArray.push(data[ele]);
                    }
                }
            }
            else {
            }
        });
        returnObj['field'] = fieldArray;
        returnObj['value'] = valueArray;
        return returnObj;
    }
    async createObjectInsertUser(tableName, data) {
        const returnObj = {};
        const fieldArray = [];
        const valueArray = [];
        const datatype = [];
        returnObj['table'] = tableName;
        const query = `  SELECT 
    COLUMN_NAME, 
    DATA_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = '${tableName}';`;
        const result = await this.executeUserQuery(query, []);
        for (const item of result) {
            datatype.push(JSON.parse(JSON.stringify(item)));
        }
        Object.keys(data).forEach((ele) => {
            if (data[ele] == 0) {
                data[ele] = data[ele].toString();
            }
            if (data[ele] != '' &&
                data[ele] != null &&
                data[ele] != undefined &&
                data[ele] != 'NULL') {
                const filterObj = datatype.filter((eles) => eles.COLUMN_NAME === ele);
                if (filterObj.length != 0) {
                    if (filterObj[0].DATA_TYPE == 'nvarchar' || filterObj[0].DATA_TYPE == 'varchar' || filterObj[0].DATA_TYPE == 'string' || filterObj[0].DATA_TYPE == 'char') {
                        fieldArray.push(ele);
                        valueArray.push(`'${data[ele]}'`);
                    }
                    else if (filterObj[0].DATA_TYPE == 'bigint' || filterObj[0].DATA_TYPE == 'int' || filterObj[0].DATA_TYPE == 'numeric' || filterObj[0].DATA_TYPE == 'nchar' || filterObj[0].DATA_TYPE == 'number' || filterObj[0].DATA_TYPE == 'decimal') {
                        fieldArray.push(ele);
                        valueArray.push(data[ele]);
                    }
                    else if (filterObj[0].DATA_TYPE === 'bit' && typeof data[ele] == 'boolean') {
                        fieldArray.push(ele);
                        valueArray.push(data[ele] ? '1' : '0');
                    }
                    else if (filterObj[0].DATA_TYPE === 'date') {
                        fieldArray.push(ele);
                        valueArray.push(`'${data[ele]}'`);
                    }
                    else {
                        throw new common_1.BadRequestException(`Something went wrong we want ${filterObj[0].DATA_TYPE} column name ${filterObj[0].COLUMN_NAME} but you send ${typeof (data[ele])}`);
                    }
                }
            }
            else {
            }
        });
        returnObj['field'] = fieldArray;
        returnObj['value'] = valueArray;
        return returnObj;
    }
    async selectAll(data) {
        var _a;
        let query = `SELECT `;
        if (data.hasOwnProperty('view')) {
            if (((_a = data === null || data === void 0 ? void 0 : data.view) === null || _a === void 0 ? void 0 : _a.length) != 0) {
                for (const [i, value] of data.view.entries()) {
                    if (i === data.view.length - 1) {
                        query += ` ${value}`;
                    }
                    else {
                        query += ` ${value},`;
                    }
                }
            }
            else {
                query += '*';
            }
        }
        else {
            query += '*';
        }
        query += ` FROM ${data.table}`;
        if (data.hasOwnProperty('join')) {
            for (const item of data.join) {
                for (const [key, value] of Object.entries(item)) {
                    query += ` ${key} ${value[0].table} on ${value[0].table}.${value[0].relationColumn} = ${data.table}.${value[0].mainColumn}`;
                }
            }
        }
        if (data.hasOwnProperty('condition')) {
            if ((data === null || data === void 0 ? void 0 : data.condition.length) != 0) {
                query += ` where`;
                for (const item of data.condition) {
                    if ((item === null || item === void 0 ? void 0 : item.type) == 'BETWEEN') {
                        query += `${item.condition} ${item.column} BETWEEN `;
                        for (const [i, value] of item.value.entries()) {
                            if (i === item.value.length - 1) {
                                query += ` AND ${value}`;
                            }
                            else {
                                query += ` ${value}`;
                            }
                        }
                    }
                    else {
                        for (const [key, value] of Object.entries(item)) {
                            if (key != 'type') {
                                query += ` ${key} = '${value}'`;
                            }
                            else {
                                query += ` ${value}`;
                            }
                        }
                    }
                }
            }
        }
        if (data.hasOwnProperty('sort')) {
            if (data.sort[0].column.length != 0) {
                query += ' order by ';
                for (const [i, value] of data.sort[0].column.entries()) {
                    if (i === data.sort[0].column.length - 1) {
                        query += ` ${value}`;
                    }
                    else {
                        query += ` ${value},`;
                    }
                }
                query += ` ${data.sort[0].order}`;
            }
        }
        if (data.user == 1) {
            let dataset = await this.executeUserQuery(query, []);
            return dataset;
        }
        else {
            let dataset = await this.executeQuery(query, []);
            return dataset;
        }
    }
    async updateData(data, type = 'main') {
        let updateString = '';
        let query = '';
        let dataset = {};
        if (type == "user") {
            dataset = await this.createObjectInsertUser(data.tableName, data.data);
        }
        else {
            dataset = await this.createObjectInsert(data.tableName, data.data);
        }
        if (dataset.field.length == dataset.value.length) {
            for (let i = 0; i < dataset.field.length; i++) {
                if (i != dataset.field.length - 1) {
                    updateString += `${dataset.field[i]} = ${dataset.value[i]}, `;
                }
                else {
                    updateString += `${dataset.field[i]} = ${dataset.value[i]} `;
                }
            }
            query = `update ${dataset.table} set ${updateString} `;
            if (data.hasOwnProperty('condition')) {
                if ((data === null || data === void 0 ? void 0 : data.condition.length) != 0) {
                    query += ` where`;
                    for (let item of data.condition) {
                        if ((item === null || item === void 0 ? void 0 : item.type) == 'BETWEEN') {
                            query += `${item.condition} ${item.column} BETWEEN `;
                            for (const [i, value] of item.value.entries()) {
                                if (i === item.value.length - 1) {
                                    query += ` AND ${value}`;
                                }
                                else {
                                    query += ` ${value}`;
                                }
                            }
                        }
                        else {
                            for (const [key, value] of Object.entries(item)) {
                                if (key != 'type') {
                                    query += ` ${key} = ${value}`;
                                }
                                else {
                                    query += ` ${value}`;
                                }
                            }
                        }
                    }
                }
            }
            return query;
        }
        else {
            throw new common_1.BadRequestException(`Something went wrong in query column and value length not matched`);
        }
    }
    async updateUserData(data) {
        let updateString = '';
        let query = '';
        let dataset = await this.createObjectInsertUser(data.tableName, data.data);
        if (dataset.field.length == dataset.value.length) {
            for (let i = 0; i < dataset.field.length; i++) {
                if (i != dataset.field.length - 1) {
                    updateString += `${dataset.field[i]} = ${dataset.value[i]}, `;
                }
                else {
                    updateString += `${dataset.field[i]} = ${dataset.value[i]} `;
                }
            }
            query = `update ${dataset.table} set ${updateString} `;
            if (data.hasOwnProperty('condition')) {
                if ((data === null || data === void 0 ? void 0 : data.condition.length) != 0) {
                    query += ` where`;
                    for (let item of data.condition) {
                        if ((item === null || item === void 0 ? void 0 : item.type) == 'BETWEEN') {
                            query += `${item.condition} ${item.column} BETWEEN `;
                            for (const [i, value] of item.value.entries()) {
                                if (i === item.value.length - 1) {
                                    query += ` AND ${value}`;
                                }
                                else {
                                    query += ` ${value}`;
                                }
                            }
                        }
                        else {
                            for (const [key, value] of Object.entries(item)) {
                                if (key != 'type') {
                                    query += ` ${key} = ${value}`;
                                }
                                else {
                                    query += ` ${value}`;
                                }
                            }
                        }
                    }
                }
            }
            return await this.executeUserQuery(query);
        }
        else {
            throw new common_1.BadRequestException(`Something went wrong in query column and value length not matched`);
        }
    }
    async getDatatableDataForClientSide(data) {
        let dataset = await this.selectAll(data);
        return { data: dataset };
    }
    async execSpWithParams(data, mult = 0) {
        if (data.params.length == 0 || data.name == '') {
            throw new common_1.BadRequestException('Please send proper data for sp');
        }
        else {
            let spString = `${data.name} ${data.params.toString()}`;
            if (mult == 1) {
                console.log(spString);
                return await this.executeQueryForMultTable(spString);
            }
            else {
                console.log(spString);
                return await this.executeQuery(spString);
            }
        }
    }
    async execUserSpWithParams(data, mult = 0) {
        if (data.params.length == 0 || data.name == '') {
            throw new common_1.BadRequestException('Please send proper data for sp');
        }
        else {
            let spString = `${data.name} ${data.params.toString()}`;
            if (mult == 1) {
                return await this.executeUserQueryForMultTable(spString);
            }
            else {
                return await this.executeUserQuery(spString);
            }
        }
    }
    async execOnlySp(data) {
        if (data.name == '') {
            throw new common_1.BadRequestException('Please send proper sp');
        }
        else {
            let spString = `${data.name}`;
            return await this.executeQuery(spString);
        }
    }
    async executeQuery(query, parameters) {
        const pool = await (0, connection_pool_db_1.getPool)();
        try {
            console.log(query);
            if (config_config_1.__DATABASE_TYPE == "MSSQL") {
                const result = await pool.request().query(query);
                return result.recordset;
            }
            else if (config_config_1.__DATABASE_TYPE == "MYSQL") {
                const [rows] = await pool.execute(query, parameters);
                return rows;
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async executeInsertQuery(queries) {
        if (!queries || queries.length === 0) {
            throw new Error("No queries provided");
        }
        console.log("Bundle of Transaction : ", queries);
        if (config_config_1.__DATABASE_TYPE == "MSSQL") {
            const pool = await (0, connection_pool_db_1.getPool)();
            const transaction = pool.transaction();
            try {
                await transaction.begin();
                const request = transaction.request();
                for (const query of queries) {
                    if (!query || typeof query !== "string") {
                        throw new Error("Invalid query provided");
                    }
                    await request.query(query);
                }
                await transaction.commit();
                console.log("Transaction committed successfully.");
            }
            catch (error) {
                await transaction.rollback();
                console.error("Transaction rolled back due to error:", error);
                throw error;
            }
        }
        else if (config_config_1.__DATABASE_TYPE == "MYSQL") {
            const pool = await (0, connection_pool_db_1.getPool)();
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
                for (const query of queries) {
                    if (!query || typeof query !== "string") {
                        throw new Error("Invalid query provided");
                    }
                    await connection.query(query);
                }
                await connection.commit();
                console.log("Transaction committed successfully.");
            }
            catch (error) {
                await connection.rollback();
                console.error("Transaction rolled back due to error:", error);
                throw error;
            }
            finally {
                connection.release();
            }
        }
    }
    async executeQueryForMultTable(query, parameters) {
        try {
            await connection_pool_db_1.__databaseConfig_ERP.connect();
            const request = connection_pool_db_1.__databaseConfig_ERP.request();
            if (parameters) {
                for (const [key, value] of Object.entries(parameters)) {
                    request.input(key, value);
                }
            }
            const result = await request.query(query);
            connection_pool_db_1.__databaseConfig_ERP.close();
            return result.recordsets;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        finally {
            if (connection_pool_db_1.__databaseConfig_ERP.connected) {
                connection_pool_db_1.__databaseConfig_ERP.close();
            }
        }
    }
    async executeUserQuery(query, parameters) {
        try {
            await connection_pool_db_1.__databaseConfig_USER.connect();
            const request = connection_pool_db_1.__databaseConfig_USER.request();
            if (parameters) {
                for (const [key, value] of Object.entries(parameters)) {
                    request.input(key, value);
                }
            }
            console.log(query);
            const result = await request.query(query);
            connection_pool_db_1.__databaseConfig_USER.close();
            return result.recordset;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        finally {
            if (connection_pool_db_1.__databaseConfig_USER.connected) {
                connection_pool_db_1.__databaseConfig_USER.close();
            }
        }
    }
    async executeUserQueryForMultTable(query, parameters) {
        try {
            await connection_pool_db_1.__databaseConfig_USER.connect();
            const request = connection_pool_db_1.__databaseConfig_USER.request();
            if (parameters) {
                for (const [key, value] of Object.entries(parameters)) {
                    request.input(key, value);
                }
            }
            const result = await request.query(query);
            connection_pool_db_1.__databaseConfig_USER.close();
            return result.recordsets;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        finally {
            if (connection_pool_db_1.__databaseConfig_USER.connected) {
                connection_pool_db_1.__databaseConfig_USER.close();
            }
        }
    }
}
exports.SQL = SQL;
//# sourceMappingURL=sql.sql.js.map