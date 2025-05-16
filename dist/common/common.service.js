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
exports.CommonService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const sql_sql_1 = require("../database/sql.sql");
let CommonService = class CommonService {
    constructor(sql, config) {
        this.sql = sql;
        this.config = config;
    }
    async menuDetails(data) {
        console.log(data);
        let details = {
            "table": "Menus",
            "view": [],
            "condition": [{
                    "MENU_DOC_NO": data.menu_doc_no
                }],
            "user": 1
        };
        if (data.hasOwnProperty('menu_module')) {
            let obj = {
                "type": "AND",
                "MODULE_NO": data.menu_module
            };
            details.condition.push(obj);
        }
        if (data.hasOwnProperty('menu_key')) {
            let obj = {
                "type": "AND",
                "MENU_KEY": data.menu_key
            };
            details.condition.push(obj);
        }
        return await this.sql.selectAll(details);
    }
    async menuDocWiseNevigation(data) {
        console.log(data);
        let tran_type = data.menu_doc_no.substring(0, 3);
        let tran_subType = data.menu_doc_no.slice(-2);
        let details = {
            "table": "CNFTRANTYPES",
            "view": [],
            "condition": [{
                    "TRAN_TYPE": tran_type,
                }, {
                    "type": 'AND',
                    "TRAN_SUBTYPE": tran_subType,
                }]
        };
        return await this.sql.selectAll(details);
    }
    async MSTDocWiseNevigation(data) {
        console.log(data);
        let details = {
            "table": "CNFMASTTYPES",
            "view": [],
            "condition": [{
                    "CODE": data.menu_doc_no,
                }]
        };
        return await this.sql.selectAll(details);
    }
    async getHelpList(data) {
        let object = {
            name: 'Get_HelpList',
            params: [data.COMPANYID, data.TableName, data.CompanyidColumn, data.HelpColumnNames, data.HelpColumnFilter, data.SortOrder, data.ExecFlag]
        };
        return await this.sql.execSpWithParams(object);
    }
    async getUserAccess(data) {
        let object = {
            name: 'GET_VOUTYPE_FROM_MENUDOC',
            params: [data.CompUnit, data.MenuDocNo, data.UserID]
        };
        return await this.sql.execSpWithParams(object);
    }
    async GET_VOUTYPE_FROM_MENUDOC(data) {
        let object = {
            name: 'GET_VOUTYPE_FROM_MENUDOC',
            params: [data.CompUnit, data.MenuDocNo, data.UserID]
        };
        return await this.sql.execSpWithParams(object);
    }
    async getSpData(data) {
        let object = {
            name: data.SPname,
            params: data.params,
        };
        return await this.sql.execSpWithParams(object, data.multiflag);
    }
    async getSp(data) {
        let object = {
            name: data.SPname,
        };
        return await this.sql.execOnlySp(object);
    }
    async menuNavDetails() {
        let modules = await this.sql.executeUserQuery(`select MODULE_NO as id,MODULE_NAME as label from Modules where STATUS_CODE = 0`);
        for (let item of modules) {
            let subArray = await this.sql.executeUserQuery(`select MODULE_NO as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = 0`);
            if (subArray.length != 0) {
                item['subItems'] = subArray;
                if (subArray.length != 0) {
                    for (let ele of subArray) {
                        if (ele.link == null || ele.link == "") {
                            delete ele.link;
                        }
                        let subSubArray = await this.sql.executeUserQuery(`select PARENT as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = ${ele.id}`);
                        if (subSubArray.length != 0) {
                            ele['subItems'] = subSubArray;
                            if (subSubArray.length != 0) {
                                for (let ele1 of subSubArray) {
                                    if (ele1.link == null || ele1.link == "") {
                                        delete ele1.link;
                                    }
                                    let subSub1Array = await this.sql.executeUserQuery(`select PARENT as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = ${ele1.id}`);
                                    if (subSub1Array.length != 0) {
                                        ele1['subItems'] = subSub1Array;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return { data: modules };
    }
    async getUserSpData(data) {
        let object = {
            name: data.SPname,
            params: data.params
        };
        return await this.sql.execUserSpWithParams(object, data.multiflag);
    }
    async Sel_MasterCodeList(data) {
        let object = {
            name: 'Sel_MasterCodeList',
            params: [data.Code, data.HelpColumnFilter]
        };
        return await this.sql.execSpWithParams(object);
    }
    async Get_TableFieldswithClause(data) {
        let object = {
            name: 'Get_TableFieldswithClause',
            params: [data.TableName, data.TableColName, data.Whereclause]
        };
        return await this.sql.execSpWithParams(object);
    }
    async insert_MstMaterials(data) {
        let tableName = 'MSTMATERIALS';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });
            let a = await this.sql.executeQuery(`Get_Next_Master_Code '101',${tableName},'CODE',10,'${prefix[0]['TYPE_CODE']}'`);
            data['CODE'] = a[0][''];
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data);
            queryArray.push(result);
        }
        else {
            let codeValue = data.CODE;
            delete data['CODE'];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.sql.updateData(dataset));
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_MstCommunit(data) {
        let tableName = 'MSTCOMMUNIT';
        let queryArray = new Array();
        let prefix = await this.MSTDocWiseNevigation({
            menu_doc_no: data.MenuDocNo,
        });
        queryArray.push(`DELETE FROM MSTCOMMUNIT WHERE CODE = '${data.CODE}'`);
        data['tableName'] = tableName;
        let result = await this.sql.insertData(data);
        queryArray.push(result);
        return await this.sql.executeInsertQuery(queryArray);
    }
    async DeleteQury(DATA) {
        let tableNameArr = [];
        let colExist;
        let DeletedStatus;
        tableNameArr = await this.sql.executeQuery(`TABLEASSIGN ${DATA.TRAN_NO}`);
        for (let item of tableNameArr) {
            colExist = await this.sql.executeQuery(`SELECT column_name FROM information_schema.columns WHERE table_name = '${item.tname}' AND column_name = 'SYSCHNG_REMARK'`);
            if (colExist.length != 0) {
                DeletedStatus = await this.sql.executeQuery(`update ${item.tname} set SYSCHNG_REMARK ='${DATA.SYSCHNG_REMARK}' , STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO}`);
            }
            else {
                DeletedStatus = await this.sql.executeQuery(`update ${item.tname} set  STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO}`);
            }
        }
        let newArray = new Array();
        for (let item of tableNameArr) {
            if (item.colname.includes('REF')) {
                let obj = {
                    'TableName': item.tname,
                    'ColumnName': item.colname
                };
                let result = await this.sql.executeQuery(item.query);
                obj['TRAN_NO'] = result[0].TRAN_NO;
                newArray.push(obj);
            }
            console.log(newArray);
        }
        if (newArray.length != 0) {
            tableNameArr = await this.sql.executeQuery(`TABLEASSIGN ${newArray[0].TRAN_NO}`);
            for (let item of tableNameArr) {
                colExist = await this.sql.executeQuery(`SELECT column_name FROM information_schema.columns WHERE table_name = '${item.tname}' AND column_name = 'SYSCHNG_REMARK'`);
                if (colExist.length != 0) {
                    DeletedStatus = await this.sql.executeQuery(`update ${item.tname} set SYSCHNG_REMARK ='${DATA.SYSCHNG_REMARK}' , STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${newArray[0].TRAN_NO}`);
                }
                else {
                    DeletedStatus = await this.sql.executeQuery(`update ${item.tname} set  STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${newArray[0].TRAN_NO}`);
                }
            }
        }
        return DeletedStatus;
    }
    async MASTDeleteQury(DATA) {
        return await this.sql.executeQuery(`UPDATE ${DATA.TABLE_NAME} SET  STATUS_CODE = '${DATA.STATUS_CODE}', SYSCHNG_REMARK = N'${DATA.SYSCHNG_REMARK}' WHERE ${DATA.WHERE}`);
    }
    async insert_MstMatGroup(data) {
        let tableName = 'MSTMATGROUP';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });
            let a = await this.sql.executeQuery(`Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`);
            data['CODE'] = a[0][''];
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data);
            queryArray.push(result);
        }
        else {
            let codeValue = data.CODE;
            delete data['CODE'];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.sql.updateData(dataset));
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_CNFMATERIALS(data) {
        let tableName = 'CNFMATERIALS';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });
            let a = await this.sql.executeQuery(`SELECT MAX(CODE) + 1 FROM CNFMATERIALS`);
            data['CODE'] = a[0][''];
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data);
            queryArray.push(result);
        }
        else {
            let codeValue = data.CODE;
            delete data['CODE'];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.sql.updateData(dataset));
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_MstMatLocation(data) {
        let tableName = 'MSTMATLOCATION';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });
            let a = await this.sql.executeQuery(`Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`);
            data['CODE'] = a[0][''];
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data);
            queryArray.push(result);
        }
        else {
            let codeValue = data.CODE;
            delete data['CODE'];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.sql.updateData(dataset));
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_CnfRateExcise(data) {
        let tableName = 'CNFRATEEXCISE';
        let queryArray = new Array();
        console.log(data);
        if (data.CODE == undefined) {
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });
            let a = await this.sql.executeQuery(`Get_Next_Master_Code '101',${tableName},'CODE',7,'${prefix[0]['TYPE_CODE']}'`);
            data['CODE'] = a[0][''];
            data['tableName'] = tableName;
            console.log(data);
            let result = await this.sql.insertData(data);
            queryArray.push(result);
        }
        else {
            console.log(data);
            let codeValue = data.CODE;
            delete data['CODE'];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.sql.updateData(dataset));
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_GstRateCategory(data) {
        data = data.CNFRATEGST;
        let tableName = 'CNFRATEGST';
        let queryArray = new Array();
        console.log(data);
        for (let item of data) {
            if (item.isInsert == true) {
                item['tableName'] = tableName;
                console.log(item);
                let result = await this.sql.insertData(item);
                queryArray.push(result);
            }
            else {
                console.log(item);
                let codeValue = item.CODE;
                delete item['CODE'];
                let dataset = {};
                dataset = {
                    data: item,
                    condition: [
                        {
                            CODE: codeValue,
                        },
                    ],
                    tableName: tableName,
                };
                queryArray.push(await this.sql.updateData(dataset));
            }
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_MSTACCTGL(data) {
        data = data.MSTACCTGL;
        let tableName = 'MSTACCTGL';
        let queryArray = new Array();
        console.log(data);
        if (!data.GL_ACNO) {
            data['tableName'] = tableName;
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });
            let a = await this.sql.executeQuery(`Get_Next_Master_Code '101',${tableName},'GL_ACNO',9,'${prefix[0]['TYPE_CODE']}'`);
            data['GL_ACNO'] = a[0][''];
            console.log(data);
            let result = await this.sql.insertData(data);
            queryArray.push(result);
        }
        else {
            console.log(data);
            let codeValue = data.GL_ACNO;
            delete data['GL_ACNO'];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        GL_ACNO: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.sql.updateData(dataset));
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async Ins_ItarMaster(data) {
        let tableName = data.TABLE_NAME;
        let queryArray = new Array();
        if (data.CODE == undefined) {
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });
            let a = await this.sql.executeQuery(`Get_Next_Master_Code '101',${tableName},'CODE',5,'${prefix[0]['TYPE_CODE']}'`);
            data['CODE'] = a[0][''];
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data);
            queryArray.push(result);
        }
        else {
            let codeValue = data.CODE;
            delete data['CODE'];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.sql.updateData(dataset));
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_MstMSTCOMMGODOWN(data) {
        let tableName = 'MSTCOMMGODOWN';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });
            let a = await this.sql.executeQuery(`Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`);
            data['CODE'] = a[0][''];
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data);
            queryArray.push(result);
        }
        else {
            let codeValue = data.CODE;
            delete data['CODE'];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.sql.updateData(dataset));
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_glsubgl(data) {
        let tableName = 'MSTACCTGLSUB';
        let queryArray = new Array();
        if (data.SUB_GLACNO == undefined) {
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });
            let a = await this.sql.executeQuery(`Get_Next_Master_Code '101',${tableName},'SUB_GLACNO',9,'${prefix[0]['TYPE_CODE']}'`);
            data['SUB_GLACNO'] = a[0][''];
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data);
            queryArray.push(result);
            if (data.hasOwnProperty('MSTACCTGLSUBDETAILS')) {
                let MSTACCTGLSUBDETAILS = data.MSTACCTGLSUBDETAILS;
                MSTACCTGLSUBDETAILS["SUB_GLACNO"] = a[0][''];
                MSTACCTGLSUBDETAILS["tableName"] = "MSTACCTGLSUBDETAILS";
                let result = await this.sql.insertData(MSTACCTGLSUBDETAILS);
                queryArray.push(result);
            }
        }
        else {
            let codeValue = data.SUB_GLACNO;
            delete data['SUB_GLACNO'];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        SUB_GLACNO: codeValue,
                    },
                ],
                tableName: tableName,
            };
            queryArray.push(await this.sql.updateData(dataset));
            if (data.hasOwnProperty('MSTACCTGLSUBDETAILS')) {
                let MSTACCTGLSUBDETAILS = data.MSTACCTGLSUBDETAILS;
                delete MSTACCTGLSUBDETAILS['SUB_GLACNO'];
                let dataset = {};
                dataset = {
                    data: MSTACCTGLSUBDETAILS,
                    condition: [
                        {
                            SUB_GLACNO: codeValue
                        },
                    ],
                    tableName: "MSTACCTGLSUBDETAILS",
                };
                queryArray.push(await this.sql.updateData(dataset));
            }
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async chckDuplicateChllnNO(data) {
        let object = {
            name: 'Sel_ChallensOfGRNMAIN',
            params: [data.COMPANY_ID, data.SUB_GLCODE]
        };
        return this.sql.execSpWithParams(object);
    }
    async getPostKeyData() {
        return await this.sql.executeQuery(`select * from CNFMATRIX order by CODE`);
    }
    async getGstCategoryData() {
        let date = moment().format('YYYYMMDD');
        let object = {
            name: 'Sel_CNFRATEGST',
            params: [date, 0]
        };
        return await this.sql.execSpWithParams(object);
    }
    async getConstantAccount(data) {
        return await this.sql.executeQuery(`select * from MSTACCTCONST where CODE = ${data.CODE}`);
    }
    async getMaterialDetails(data) {
        let object = {
            name: 'Sel_GetMaterialsGSTList',
            params: [data.materialType, `'${data.chrWhereClause}'`, `''`]
        };
        return await this.sql.execSpWithParams(object);
    }
    async getPostKeyDataIdWise(data) {
        let result = await this.sql.executeQuery(`Sel_CNFMATRIXDETAIL ${data.code}, ${data.type}`);
        return result;
    }
    async Sel_TransactionsFinance(data) {
        let object = {
            name: 'Sel_TransactionsFinance',
            params: [data.CompanyID, data.TranType, data.UserId, data.FromDate, data.ToDate,]
        };
        console.log(object);
        return await this.sql.execSpWithParams(object);
    }
    async Sel_ControlAcctGl(data) {
        let object = {
            name: 'Sel_ControlAcctGl',
            params: [data.SUBGLCode]
        };
        console.log(object);
        return await this.config.execSpWithParams(object);
    }
    async Ins_LedgerControlAcc(data) {
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        let queryArray = [];
        let MSTACCTGLSUBGL = data.MSTACCTGLSUBGL;
        for (let index = 0; index < MSTACCTGLSUBGL.length; index++) {
            let item = MSTACCTGLSUBGL[index];
            if (index == 0) {
                queryArray.push(`DELETE FROM MSTACCTGLSUBGL WHERE SUBGL_CODE = ${item.SUBGL_CODE}`);
            }
            let temp = await this.config.executeQuery(`SELECT * FROM MSTACCTGLSUBGL WHERE SUBGL_CODE = ${item.SUBGL_CODE} AND GL_ACNO = ${item.GL_ACNO}`);
            if (temp.length > 0) {
                item['SYSADD_DATETIME'] = temp[0]['SYSADD_DATETIME'];
                item['SYSADD_LOGIN'] = temp[0]['SYSADD_LOGIN'];
            }
            else {
                item['SYSADD_DATETIME'] = sysDate[0][''];
            }
            item['SYSCHNG_DATETIME'] = sysDate[0][''];
            item['SYSCHNG_LOGIN'] = item['SYSADD_LOGIN'];
            item["tableName"] = "MSTACCTGLSUBGL";
            queryArray.push(await this.sql.insertData(item));
        }
        return await this.config.executeInsertQuery(queryArray);
    }
    async Sel_ReportHelp(data) {
        let object = {
            name: 'Sel_ReportHelp',
            params: [data.CompanyId, data.TypeList, data.SubType]
        };
        console.log(object);
        return await this.config.execSpWithParams(object);
    }
    async Sel_ReportLinking(data) {
        let object = {
            name: 'Sel_ReportLinking',
            params: [data.CompanyId, data.ReportCode, data.CODE]
        };
        console.log(object);
        return await this.config.execSpWithParams(object);
    }
    async insert_CNFREPORTD(data) {
        let tableName = 'CNFREPORTD';
        let queryArray = new Array();
        queryArray.push(`DELETE CNFREPORTD WHERE REPORT_CODE = ${data.CNFREPORTD[0].REPORT_CODE} AND CODE = ${data.CNFREPORTD[0].CODE}`);
        for (let item of data.CNFREPORTD) {
            item['tableName'] = tableName;
            let result = await this.config.insertData(item);
            queryArray.push(result);
        }
        return await this.config.executeInsertQuery(queryArray);
    }
    async insert_MSTACCTALLOCATION(data) {
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        let queryArray = [];
        let MSTACCTALLOCATION = data.MSTACCTALLOCATION;
        let MSTACCTALLOCATION_del = data.MSTACCTALLOCATION_del;
        for (let index = 0; index < MSTACCTALLOCATION.length; index++) {
            let item = MSTACCTALLOCATION[index];
            queryArray.push(`DELETE FROM MSTACCTALLOCATION WHERE GL_ACNO = ${item.GL_ACNO} AND AC_TYPE = ${item.AC_TYPE}`);
            let temp = await this.config.executeQuery(`SELECT * FROM MSTACCTALLOCATION WHERE GL_ACNO = ${item.GL_ACNO} AND AC_TYPE = ${item.AC_TYPE}`);
            if (temp.length > 0) {
                item['SYSADD_DATETIME'] = temp[0]['SYSADD_DATETIME'];
                item['SYSADD_LOGIN'] = temp[0]['SYSADD_LOGIN'];
            }
            else {
                item['SYSADD_DATETIME'] = sysDate[0][''];
            }
            item['SYSCHNG_DATETIME'] = sysDate[0][''];
            item['SYSCHNG_LOGIN'] = item['SYSADD_LOGIN'];
            item["SR_NO"] = 1;
            item["tableName"] = "MSTACCTALLOCATION";
            queryArray.push(await this.sql.insertData(item));
        }
        for (let index = 0; index < MSTACCTALLOCATION_del.length; index++) {
            let item = MSTACCTALLOCATION_del[index];
            queryArray.push(`DELETE FROM MSTACCTALLOCATION WHERE GL_ACNO = ${item.GL_ACNO} AND AC_TYPE = ${item.AC_TYPE}`);
        }
        return await this.config.executeInsertQuery(queryArray);
    }
    async insert_MstCommTerms(data) {
        let queryArray = new Array();
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        let prefix = await this.MSTDocWiseNevigation({
            menu_doc_no: data.MenuDocNo,
        });
        let tableName = 'MSTCOMMTERMS';
        if (data.CODE == undefined) {
            let a = await this.config.executeQuery(`Get_Next_Master_Code '',${tableName},'CODE',3,''`);
            data['CODE'] = a[0][''];
            data['tableName'] = tableName;
            data['SYSCHNG_DATETIME'] = sysDate[0][''];
            data['SYSADD_DATETIME'] = sysDate[0][''];
            let result = await this.config.insertData(data);
            queryArray.push(result);
            return await this.config.executeInsertQuery(queryArray);
        }
        else {
            let codeValue = data.CODE;
            delete data['CODE'];
            data['SYSCHNG_DATETIME'] = sysDate[0][''];
            let dataset = {};
            dataset = {
                data: data,
                condition: [
                    {
                        CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return await this.config.executeInsertQuery([await this.config.updateData(dataset)]);
        }
    }
    async insert_CNFPOSTKEYSGL(data) {
        let tableName = 'CNFPOSTKEYSGL';
        for (let item of data.CNFPOSTKEYSGL) {
            let codeValue = item.POSTKEY_CODE;
            delete item['CODE'];
            let dataset = {};
            dataset = {
                data: item,
                condition: [
                    {
                        POSTKEY_CODE: codeValue,
                    },
                ],
                tableName: tableName,
            };
            return this.config.executeInsertQuery([await this.config.updateData(dataset)]);
        }
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sql_sql_1.SQL,
        sql_sql_1.SQL])
], CommonService);
//# sourceMappingURL=common.service.js.map