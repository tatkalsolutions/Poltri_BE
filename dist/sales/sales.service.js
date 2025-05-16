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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const sql_sql_1 = require("../database/sql.sql");
let SalesService = class SalesService {
    constructor(config) {
        this.config = config;
    }
    async mainSalesInsert(data) {
        var _a;
        let queryArray = new Array();
        let dsHeader = data.dsHeader;
        let dsAccount = data.dsAccount;
        let dsMaterial = data.dsMaterial;
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        let TranNo;
        if (dsHeader['TRAN_NO'] != 0) {
            TranNo = dsHeader['TRAN_NO'];
            await this.config.executeQuery(`delete from TRNACCTMATH where TRAN_NO = ${TranNo}`);
        }
        else {
            let autoIncremented = await this.config.executeQuery(`Get_Next_Trans_No '101',${dsHeader.TRAN_TYPE},${dsHeader.TRAN_SUBTYPE},${dsHeader.TRAN_SERIES},'${dsHeader.TRAN_DATE}','TRNACCTMATH'`);
            TranNo = autoIncremented[0][''];
            dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
            dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
            dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
            dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        }
        let FormatDocNumber = await this.config.executeQuery(` select dbo.FormatDocNo(${TranNo})`);
        dsHeader['TRAN_NO'] = TranNo;
        dsHeader['SHORT_NARRTN'] = "बिल नंबर " + TranNo.slice(-6) + " प्रमाणे";
        dsHeader['IS_FLAG'] = 0;
        dsHeader['REFCOMPUNIT_ID'] = dsHeader.COMPUNIT_ID;
        dsHeader['tableName'] = 'TRNACCTMATH';
        let query = await this.config.insertData(dsHeader);
        queryArray.push(query);
        let MatrixAccountPostingArray = new Array();
        for (let item of dsMaterial) {
            if (MatrixAccountPostingArray.length == 0) {
                let obj = {
                    GL_ACNO: item.SALE_GLACNO,
                    SUB_GLACNO: item.SALE_SUB_GLACNO,
                    TRAN_AMT: item.AMOUNT
                };
                MatrixAccountPostingArray.push(obj);
            }
            else {
                let ele = MatrixAccountPostingArray.findIndex(x => x.GL_ACNO == item.SALE_GLACNO && x.SUB_GLACNO == item.SALE_SUB_GLACNO);
                if (ele != -1) {
                    MatrixAccountPostingArray[ele].TRAN_AMT = Number(MatrixAccountPostingArray[ele].TRAN_AMT) + Number(item.AMOUNT);
                }
                else {
                    let obj = {
                        GL_ACNO: item.GL_ACNO,
                        SUB_GLACNO: item.SUB_GLACNO,
                        TRAN_AMT: item.AMOUNT
                    };
                    MatrixAccountPostingArray.push(obj);
                }
            }
        }
        for (let item of MatrixAccountPostingArray) {
            if (item.AMOUNT != 0) {
                item['DR_CR'] = 'C';
                dsAccount.push(item);
            }
        }
        let MatrixAccountPostingArray1 = new Array();
        for (let item of dsMaterial) {
            if (MatrixAccountPostingArray1.length == 0) {
                let obj = {
                    GL_ACNO: item.TAX_GLACNO,
                    SUB_GLACNO: item.SALE_GLACNO,
                    TRAN_AMT: item.TAX_AMOUNT
                };
                MatrixAccountPostingArray1.push(obj);
            }
            else {
                let ele = MatrixAccountPostingArray1.findIndex(x => x.GL_ACNO == item.TAX_GLACNO);
                if (ele != -1) {
                    MatrixAccountPostingArray1[ele].TRAN_AMOUNT = Number(MatrixAccountPostingArray1[ele].TRAN_AMOUNT) + Number(item.TAX_AMOUNT);
                }
                else {
                    let obj = {
                        GL_ACNO: item.TAX_GLACNO,
                        SUB_GLACNO: item.SALE_SUB_GLACNO,
                        TRAN_AMT: item.TAX_AMOUNT
                    };
                    MatrixAccountPostingArray1.push(obj);
                }
            }
        }
        for (let item of MatrixAccountPostingArray1) {
            item['DR_CR'] = 'C';
            dsAccount.push(item);
        }
        await this.config.executeQuery(`delete from TRNACCTPOST where TRAN_NO = ${TranNo}`);
        let SRNO = 1;
        for (let item of dsAccount) {
            if (item.TRAN_AMT != 0 && item.TRAN_AMT != '' && item.TRAN_AMT != undefined) {
                item['TRAN_NO'] = TranNo;
                item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                item['SYSADD_DATETIME'] = sysDate[0][''];
                item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
                item['SYSCHNG_DATETIME'] = sysDate[0][''];
                item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
                item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                item['tableName'] = 'TRNACCTPOST';
                item['SR_NO'] = SRNO;
                let query = await this.config.insertData(item);
                queryArray.push(query);
                SRNO++;
            }
        }
        await this.config.executeQuery(`delete from TRNACCTMATISALE where TRAN_NO = ${TranNo}`);
        let srno = 1;
        for (let item of dsMaterial) {
            if (item.NAME != '') {
                item['TRAN_NO'] = TranNo;
                if (item.hasOwnProperty('MAT_CODE')) {
                    if (item.MAT_CODE == null || item.MAT_CODE == '') {
                        item['MAT_CODE'] = item.CODE;
                    }
                }
                else {
                    item['MAT_CODE'] = item.CODE;
                }
                if (dsHeader.MENU_DOC_NO == '115043') {
                    item['CUST_SUB_GLACNO'] = dsHeader.CUST_SUB_GLACNO;
                }
                item['TAX_CODE'] = item.GST_RATECATEGORY;
                item['GL_ACNO'] = item.SALE_GLACNO;
                item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                item['SYSADD_DATETIME'] = sysDate[0][''];
                item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
                item['SYSCHNG_DATETIME'] = sysDate[0][''];
                item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
                item['tableName'] = 'TRNACCTMATISALE';
                item['SR_NO'] = srno;
                let query = await this.config.insertData(item);
                queryArray.push(query);
                srno++;
            }
        }
        queryArray.push(`delete from TRNMATPOST where TRAN_NO = ${TranNo}`);
        let srno1 = 1;
        for (let item of dsMaterial) {
            if (item.QTY != '') {
                item['TRAN_NO'] = TranNo;
                item['REF_TRANNO'] = TranNo;
                if (item.hasOwnProperty('MAT_CODE')) {
                    if (item.MAT_CODE == null || item.MAT_CODE == '') {
                        item['MAT_CODE'] = item.CODE;
                    }
                }
                else {
                    item['MAT_CODE'] = item.CODE;
                }
                if (dsHeader.MENU_DOC_NO == '115043') {
                    item['GL_ACNO1'] = dsHeader.GL_ACNO;
                    item['SUB_GLACNO1'] = dsHeader.SUB_GLACNO;
                }
                item['QTY'] = '-' + item.QTY;
                item['GODOWN_CODE'] = dsHeader.GODOWN_CODE;
                item['MAT_RATE'] = item.RATE;
                item['MAT_VALUE'] = item.AMOUNT;
                item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                item['SYSADD_DATETIME'] = sysDate[0][''];
                item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
                item['SYSCHNG_DATETIME'] = sysDate[0][''];
                item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
                item['tableName'] = 'TRNMATPOST';
                item['SR_NO'] = srno1;
                let query = await this.config.insertData(item);
                queryArray.push(query);
                srno1++;
            }
        }
        if (dsHeader.IS_GSTINVOICE == 1) {
            var GSTR1MatrixDataSet = new Array();
            for (let item of dsMaterial) {
                if (GSTR1MatrixDataSet.length == 0) {
                    GSTR1MatrixDataSet.push(item);
                }
                else {
                    let ele = GSTR1MatrixDataSet.findIndex(x => x.CHAPTER_CODE == item.CHAPTER_CODE && x.CHAPTER_NO == item.CHAPTER_NO && x.CGST_RATE == item.CGST_RATE && x.SGST_RATE == item.SGST_RATE && (x === null || x === void 0 ? void 0 : x.IGST_RATE) == (item === null || item === void 0 ? void 0 : item.IGST_RATE) && (x === null || x === void 0 ? void 0 : x.TAX_CODE) == (item === null || item === void 0 ? void 0 : item.TAX_CODE));
                    if (ele != -1) {
                        GSTR1MatrixDataSet[ele].CGST_AMOUNT = Number(GSTR1MatrixDataSet[ele].CGST_AMOUNT) + Number(item.CGST_AMOUNT);
                        GSTR1MatrixDataSet[ele].SGST_AMOUNT = Number(GSTR1MatrixDataSet[ele].SGST_AMOUNT) + Number(item.SGST_AMOUNT);
                        GSTR1MatrixDataSet[ele].IGST_AMOUNT = Number((_a = GSTR1MatrixDataSet[ele]) === null || _a === void 0 ? void 0 : _a.IGST_AMOUNT) + Number(item === null || item === void 0 ? void 0 : item.IGST_AMOUNT);
                        GSTR1MatrixDataSet[ele].AMOUNT = Number(GSTR1MatrixDataSet[ele].AMOUNT) + Number(item.AMOUNT);
                    }
                    else {
                        GSTR1MatrixDataSet.push(item);
                    }
                }
            }
            if (GSTR1MatrixDataSet.length != 0) {
                let GSTSRNO = 1;
                await this.config.executeQuery(`delete from TRNACCTMATIGSTR1 where TRAN_NO = ${TranNo}`);
                for (let item of GSTR1MatrixDataSet) {
                    if (item.NAME != '') {
                        item['TRAN_NO'] = dsHeader['TRAN_NO'];
                        item['TRAN_TYPE'] = dsHeader['TRAN_TYPE'];
                        item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                        item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                        item['SUB_GLACNO'] = dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.GSTDOC_PARTY;
                        item['ASSESSED_VALUE'] = item.AMOUNT;
                        item['STATUS_CODE'] = '0';
                        item['ADD_RATE'] = item.CESS_RATE;
                        item['ADD_AMOUNT'] = item.CESS_AMOUNT;
                        item['DR_CR'] = 'D';
                        item['VOUCHER_TYPE'] = dsHeader.VOUCHER_TYPE;
                        item['PARTY_STATE'] = dsHeader.PARTY_STATE;
                        item['PARTY_GSTINNO'] = (dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.GSTDOC_GSTINNO) == undefined ? '' : dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.PARTY_GSTINNO;
                        item['EXTREF_NO'] = (dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.EXT_REF1) == undefined ? 0 : dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.EXT_REF1;
                        item['EXTREF_DATE'] = (dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.EXT_REF_DATE1) == undefined ? '' : dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.EXT_REF_DATE1;
                        item['TRAN_AMT'] = dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.TRAN_AMT;
                        item['GSTREPORT_GROUPID'] = (dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.GSTREPORT_GROUPID) == undefined ? 0 : dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.GSTREPORT_GROUPID;
                        item['IS_GSTINREGISTERED'] = (dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.IS_GSTINREGISTERED) == undefined ? 0 : dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.IS_GSTINREGISTERED;
                        item['IS_COMPOSITEGSTIN'] = (dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.IS_COMPOSITEGSTIN) == undefined ? 0 : dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.IS_COMPOSITEGSTIN;
                        item['IS_REVERSECHARGE'] = (dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.IS_REVERSECHARGE) == undefined ? 0 : dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.IS_REVERSECHARGE;
                        item['IS_NONGSTSUPPLIES'] = (dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.IS_NONGSTSUPPLIES) == undefined ? 0 : dsHeader === null || dsHeader === void 0 ? void 0 : dsHeader.IS_NONGSTSUPPLIES;
                        item['SYSADD_DATETIME'] = sysDate[0][''];
                        item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
                        item['SYSCHNG_DATETIME'] = sysDate[0][''];
                        item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
                        item['SR_NO'] = GSTSRNO;
                        item['QTY'] = Math.abs(item['QTY']);
                        ;
                        item['IS_INELIGIBLESUPPLIES'] = dsHeader.IS_INELIGIBLESUPPLIES;
                        item['tableName'] = 'TRNACCTMATIGSTR1';
                        item['IGST_AMOUNT'] = isNaN(item.IGST_AMOUNT) ? 0 : item.IGST_AMOUNT;
                        item['IGST_RATE'] = (item === null || item === void 0 ? void 0 : item.IGST_RATE) ? item.IGST_RATE : 0;
                        let query = await this.config.insertData(item);
                        queryArray.push(query);
                        GSTSRNO++;
                    }
                }
            }
        }
        await this.config.executeInsertQuery(queryArray);
        return { 'TRAN_NO': TranNo };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sql_sql_1.SQL])
], SalesService);
//# sourceMappingURL=sales.service.js.map