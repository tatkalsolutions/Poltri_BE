"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionListService = void 0;
const common_1 = require("@nestjs/common");
const sql_sql_1 = require("../../database/sql.sql");
let TransactionListService = class TransactionListService {
    constructor(config) {
        this.config = config;
    }
    async insAndStoreConsumption(data) {
        let queryArray = new Array();
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        let SYSCHNG_LOGIN = data.SYSADD_LOGIN;
        let SYSADD_LOGIN = data.SYSADD_LOGIN;
        if (data.TRNCFEEDSTOREMATH[0].TRAN_NO == 0) {
            let a = await this.config.executeQuery(`exec Get_Next_Trans_No @COMPANY_ID='${data.TRNCFEEDSTOREMATH[0].COMPANY_ID}',@voutype='${data.TRNCFEEDSTOREMATH[0].Menu_Doc_No.substring(0, 3)}',@vouSubType=${data.TRNCFEEDSTOREMATH[0].Menu_Doc_No.substr(data.TRNCFEEDSTOREMATH[0].Menu_Doc_No.length - 2)},@vouseries='${data.TRNCFEEDSTOREMATH[0].Menu_Doc_No.substr(data.TRNCFEEDSTOREMATH[0].Menu_Doc_No.length - 2)}',@effdate='${data.TRNCFEEDSTOREMATH[0].TRAN_DATE}',@TABLE_NAME='TRNACCTMATH'`);
            for (let item of data.TRNCFEEDSTOREMATH) {
                item['TRAN_NO'] = a[0][''];
                item['SYSADD_DATETIME'] = sysDate[0][''];
                item['SYSCHNG_DATETIME'] = sysDate[0][''];
                item['SYSCHNG_LOGIN'] = SYSCHNG_LOGIN;
                item['SYSADD_LOGIN'] = SYSADD_LOGIN;
                item['tableName'] = 'TRNACCTMATH';
                let result = await this.config.insertData(item);
                queryArray.push(result);
            }
            let SR_NO = 0;
            if (data.TRNCFEEDMATPOST != undefined) {
                SR_NO = 0;
                for (let item of data.TRNCFEEDMATPOST) {
                    SR_NO++;
                    item['TRAN_NO'] = a[0][''];
                    item['REF_TRANNO'] = a[0][''];
                    item['TRAN_DATE'] = data.TRNCFEEDSTOREMATH[0].TRAN_DATE;
                    if (item.SR_NO != 9999) {
                        item['SR_NO'] = SR_NO;
                    }
                    item['tableName'] = 'TRNMATPOST';
                    let result = await this.config.insertData(item);
                    queryArray.push(result);
                }
            }
        }
        else {
            await this.config.executeQuery(`delete TRNACCTMATH where TRAN_NO = ${data.TRNCFEEDSTOREMATH[0].TRAN_NO}`);
            await this.config.executeQuery(`delete TRNMATPOST where TRAN_NO = ${data.TRNCFEEDSTOREMATH[0].TRAN_NO}`);
            for (let item of data.TRNCFEEDSTOREMATH) {
                item['TRAN_NO'] = data.TRNCFEEDSTOREMATH[0].TRAN_NO;
                item['SYSCHNG_DATETIME'] = sysDate[0][''];
                item['SYSCHNG_LOGIN'] = SYSCHNG_LOGIN;
                item['SYSADD_LOGIN'] = SYSADD_LOGIN;
                item['tableName'] = 'TRNACCTMATH';
                let result = await this.config.insertData(item);
                queryArray.push(result);
            }
            let SR_NO = 0;
            if (data.TRNCFEEDMATPOST != undefined) {
                SR_NO = 0;
                for (let item of data.TRNCFEEDMATPOST) {
                    SR_NO++;
                    item['TRAN_NO'] = data.TRNCFEEDSTOREMATH[0].TRAN_NO;
                    item['REF_TRANNO'] = data.TRNCFEEDSTOREMATH[0].TRAN_NO;
                    item['TRAN_DATE'] = data.TRNCFEEDSTOREMATH[0].TRAN_DATE;
                    if (item.SR_NO != 9999) {
                        item['SR_NO'] = SR_NO;
                    }
                    item['tableName'] = 'TRNMATPOST';
                    let result = await this.config.insertData(item);
                    queryArray.push(result);
                }
            }
        }
        return await this.config.executeInsertQuery(queryArray);
    }
    async insGhatTut(data) {
        let queryArray = new Array();
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        if (data.TRAN_NO == 0) {
            let a = await this.config.executeQuery(`exec Get_Next_Trans_No @COMPANY_ID='104',@voutype='${data.TRNCFEEDPRODH.VOUCHER_TYPE}',@vouSubType=${data.TRNCFEEDPRODH.TRAN_SUBTYPE},@vouseries='${data.TRNCFEEDPRODH.VOUCHER_SERIES}',@effdate='${data.TRNCFEEDPRODH.TRAN_DATE}',@TABLE_NAME='TRNCFEEDPRODH'`);
            data.TRNCFEEDPRODH['TRAN_NO'] = a[0][''];
            data.TRNCFEEDPRODH['SYSADD_DATETIME'] = sysDate[0][''];
            data.TRNCFEEDPRODH['SYSCHNG_DATETIME'] = sysDate[0][''];
            data.TRNCFEEDPRODH['tableName'] = 'TRNCFEEDPRODH';
            console.log(data);
            let result = await this.config.insertData(data.TRNCFEEDPRODH);
            queryArray.push(result);
            let SR_NO = 0;
            if (data.TRNCFEEDMATPOST != undefined) {
                SR_NO = 0;
                for (let item of data.TRNCFEEDMATPOST) {
                    SR_NO++;
                    item['TRAN_NO'] = a[0][''];
                    item['SR_NO'] = SR_NO;
                    item['REF_TRANNO'] = a[0][''];
                    item['TRAN_DATE'] = data.TRNCFEEDPRODH.TRAN_DATE;
                    item['tableName'] = 'TRNCFEEDMATPOST';
                    console.log(item);
                    let result = await this.config.insertData(item);
                    queryArray.push(result);
                }
            }
            if (data.TRNCFEEDSTOREMATI != undefined) {
                SR_NO = 0;
                for (let item of data.TRNCFEEDSTOREMATI) {
                    SR_NO++;
                    item['TRAN_NO'] = a[0][''];
                    item['SR_NO'] = SR_NO;
                    item['TRAN_DATE'] = data.TRNCFEEDPRODH.TRAN_DATE;
                    item['tableName'] = 'TRNCFEEDSTOREMATI';
                    console.log(item);
                    let result = await this.config.insertData(item);
                    queryArray.push(result);
                }
            }
        }
        else {
            await this.config.executeQuery(`delete TRNCFEEDPRODH where TRAN_NO = ${data.TRNCFEEDPRODH[0].TRAN_NO}`);
            await this.config.executeQuery(`delete TRNCFEEDSTOREMATI where TRAN_NO = ${data.TRNCFEEDPRODH[0].TRAN_NO}`);
            await this.config.executeQuery(`delete TRNCFEEDMATPOST where TRAN_NO = ${data.TRNCFEEDPRODH[0].TRAN_NO}`);
            for (let item of data.TRNCFEEDPRODH) {
                item['TRAN_NO'] = data.TRNCFEEDPRODH[0].TRAN_NO;
                item['SYSCHNG_DATETIME'] = sysDate[0][''];
                item['tableName'] = 'TRNCFEEDPRODH';
                console.log(item);
                let result = await this.config.insertData(item);
                queryArray.push(result);
            }
            let SR_NO = 0;
            if (data.TRNCFEEDMATPOST != undefined) {
                SR_NO = 0;
                for (let item of data.TRNCFEEDMATPOST) {
                    SR_NO++;
                    item['TRAN_NO'] = data.TRNCFEEDPRODH[0].TRAN_NO;
                    item['REF_TRANNO'] = data.TRNCFEEDPRODH[0].TRAN_NO;
                    item['SR_NO'] = SR_NO;
                    item['tableName'] = 'TRNCFEEDMATPOST';
                    console.log(item);
                    let result = await this.config.insertData(item);
                    queryArray.push(result);
                }
            }
            if (data.TRNCFEEDSTOREMATI != undefined) {
                SR_NO = 0;
                for (let item of data.TRNCFEEDSTOREMATI) {
                    SR_NO++;
                    item['TRAN_NO'] = data.TRNCFEEDPRODH[0].TRAN_NO;
                    item['SR_NO'] = SR_NO;
                    item['tableName'] = 'TRNCFEEDSTOREMATI';
                    console.log(item);
                    let result = await this.config.insertData(item);
                    queryArray.push(result);
                }
            }
        }
        return await this.config.executeInsertQuery(queryArray);
    }
};
exports.TransactionListService = TransactionListService;
exports.TransactionListService = TransactionListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sql_sql_1.SQL])
], TransactionListService);
//# sourceMappingURL=transaction-list.service.js.map