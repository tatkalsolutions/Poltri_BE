import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import { SQL } from 'src/database/sql.sql';
@Injectable()
export class CommonService {
    constructor(
        private sql: SQL,
        private config: SQL
    ) {
    }

    ///---------* Menu Doc NO using get All pages details also nevigation details
    async menuDetails(data) {
        console.log(data);
        let details = {
            "table": "Menus",
            "view": [],
            "condition": [{
                "MENU_DOC_NO": data.menu_doc_no
            }],
            "user": 1
        }

        if (data.hasOwnProperty('menu_module')) {
            let obj: any = {
                "type": "AND",
                "MODULE_NO": data.menu_module
            }
            details.condition.push(obj)
        }
        if (data.hasOwnProperty('menu_key')) {
            let obj: any = {
                "type": "AND",
                "MENU_KEY": data.menu_key
            }
            details.condition.push(obj)
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
        }
        return await this.sql.selectAll(details);
    }
    async MSTDocWiseNevigation(data) {
        console.log(data);
        // let tran_type = data.menu_doc_no.substring(0,3);
        // let tran_subType = data.menu_doc_no.slice(-2);
        let details = {
            "table": "CNFMASTTYPES",
            "view": [],
            "condition": [{
                "CODE": data.menu_doc_no,
            }]
        }
        return await this.sql.selectAll(details);
    }




    //get Common and generic function data
    async getHelpList(data) {
        let object =
        {
            name: 'Get_HelpList',
            params: [data.COMPANYID, data.TableName, data.CompanyidColumn, data.HelpColumnNames, data.HelpColumnFilter, data.SortOrder, data.ExecFlag]
        }
        return await this.sql.execSpWithParams(object);

    }

    //Menu Navigation Button Access as per user data
    async getUserAccess(data) {
        let object = {
            name: 'GET_VOUTYPE_FROM_MENUDOC',
            params: [data.CompUnit, data.MenuDocNo, data.UserID]
        }

        return await this.sql.execSpWithParams(object);

    }


    async GET_VOUTYPE_FROM_MENUDOC(data) {
        let object = {
            name: 'GET_VOUTYPE_FROM_MENUDOC',
            params: [data.CompUnit, data.MenuDocNo, data.UserID]
        }
        return await this.sql.execSpWithParams(object);
    }

    /*common endpoint for all sp*/
    async getSpData(data) {
        let object = {
            name: data.SPname,
            params: data.params,
        }
        return await this.sql.execSpWithParams(object, data.multiflag);
    }

    /*common endpoint for all sp*/
    async getSp(data) {
        let object = {
            name: data.SPname,
        }
        return await this.sql.execOnlySp(object);
    }
    //-------------------- Menu Nav Details ----------------//
    async menuNavDetails() {
        ///Get Module details
        let modules = await this.sql.executeUserQuery(`select MODULE_NO as id,MODULE_NAME as label from Modules where STATUS_CODE = 0`);
        for (let item of modules) {
            let subArray = await this.sql.executeUserQuery(`select MODULE_NO as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = 0`);
            if (subArray.length != 0) {
                item['subItems'] = subArray;
                if (subArray.length != 0) {
                    for (let ele of subArray) {
                        if (ele.link == null || ele.link == "") {
                            delete ele.link
                        }
                        let subSubArray = await this.sql.executeUserQuery(`select PARENT as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = ${ele.id}`);
                        if (subSubArray.length != 0) {
                            ele['subItems'] = subSubArray;
                            if (subSubArray.length != 0) {
                                for (let ele1 of subSubArray) {
                                    if (ele1.link == null || ele1.link == "") {
                                        delete ele1.link
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
        }
        return await this.sql.execUserSpWithParams(object, data.multiflag);
    }

    async Sel_MasterCodeList(data) {
        let object = {
            name: 'Sel_MasterCodeList',
            params: [data.Code, data.HelpColumnFilter]

        }
        return await this.sql.execSpWithParams(object, data.multiflag);
    }
    async Get_TableFieldswithClause(data) {
        let object = {
            name: 'Get_TableFieldswithClause',
            params: [data.TableName, data.TableColName, data.Whereclause]
        }
        return await this.sql.execSpWithParams(object);
    }
    async insert_MstMaterials(data) {
        let tableName = 'MSTMATERIALS';
        let queryArray = new Array();

        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.sql.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',10,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data)
            queryArray.push(result);
        } else {
            //********* update *********//
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
            queryArray.push(await this.sql.updateData(dataset))
        }
        return await this.sql.executeInsertQuery(queryArray);
    }

    async insert_MstCommunit(data) {
        let tableName = 'MSTCOMMUNIT';
        let queryArray = new Array();


        // if (data.CODE == undefined) {
        //********* insert *********//
        let prefix = await this.MSTDocWiseNevigation({
            menu_doc_no: data.MenuDocNo,
        });

        // let a = await this.sql.executeQuery(
        //     `Get_Next_Master_Code '101',${tableName},'CODE',5,'${prefix[0]['TYPE_CODE']}'`,
        // );
        // data['CODE'] = a[0][''];
        // data['SYS_TIME'] = moment().format('YYYYMMDD');
        queryArray.push(`DELETE FROM MSTCOMMUNIT WHERE CODE = '${data.CODE}'`)
        data['tableName'] = tableName;
        let result = await this.sql.insertData(data)
        queryArray.push(result);
        return await this.sql.executeInsertQuery(queryArray);

        // } else {
        //     //********* update *********//
        //     let codeValue = data.CODE;
        //     delete data['CODE'];

        //     let dataset = {};
        //     dataset = {
        //         data: data,
        //         condition: [
        //             {
        //                 CODE: codeValue,
        //             },
        //         ],
        //         tableName: tableName,
        //     };
        // queryArray.push(//     return await this.sql.updateData(dataset);)
        // }
    }

    async DeleteQury(DATA) {
        let tableNameArr = [];
        let colExist;
        let DeletedStatus;
        tableNameArr = await this.sql.executeQuery(`TABLEASSIGN ${DATA.TRAN_NO}`)
        for (let item of tableNameArr) {
            colExist = await this.sql.executeQuery(`SELECT column_name FROM information_schema.columns WHERE table_name = '${item.tname}' AND column_name = 'SYSCHNG_REMARK'`)
            if (colExist.length != 0) {
                DeletedStatus = await this.sql.executeQuery(`update ${item.tname} set SYSCHNG_REMARK ='${DATA.SYSCHNG_REMARK}' , STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO}`)
            }
            else {
                DeletedStatus = await this.sql.executeQuery(`update ${item.tname} set  STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO}`)
            }
        }
        // 

        ///------------------------ Ajit Sutar Code Date - 05/12/2024 --------------------------
        let newArray = new Array();
        for (let item of tableNameArr) {
            if (item.colname.includes('REF')) {
                let obj = {
                    'TableName': item.tname,
                    'ColumnName': item.colname
                }
                let result = await this.sql.executeQuery(item.query)
                obj['TRAN_NO'] = result[0].TRAN_NO;
                newArray.push(obj);
            }

            console.log(newArray);
        }

        if (newArray.length != 0) {
            tableNameArr = await this.sql.executeQuery(`TABLEASSIGN ${newArray[0].TRAN_NO}`)
            for (let item of tableNameArr) {
                colExist = await this.sql.executeQuery(`SELECT column_name FROM information_schema.columns WHERE table_name = '${item.tname}' AND column_name = 'SYSCHNG_REMARK'`)
                if (colExist.length != 0) {
                    DeletedStatus = await this.sql.executeQuery(`update ${item.tname} set SYSCHNG_REMARK ='${DATA.SYSCHNG_REMARK}' , STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${newArray[0].TRAN_NO}`)
                }
                else {
                    DeletedStatus = await this.sql.executeQuery(`update ${item.tname} set  STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${newArray[0].TRAN_NO}`)
                }
            }
        }
        return DeletedStatus;




        // if (DATA.SYSCHNG_REMARK != '' && DATA.SYSCHNG_REMARK != undefined) {
        //     return await this.sql.executeQuery(`UPDATE ${DATA.TABLE_NAME} SET SYSCHNG_REMARK ='${DATA.SYSCHNG_REMARK}' , STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO} `)
        // } else {
        //     return await this.sql.executeQuery(`UPDATE ${DATA.TABLE_NAME} SET  STATUS_CODE = '${DATA.STATUS_CODE}' WHERE TRAN_NO =${DATA.TRAN_NO}`)
        // }
    }

    async MASTDeleteQury(DATA) {
        return await this.sql.executeQuery(`UPDATE ${DATA.TABLE_NAME} SET  STATUS_CODE = '${DATA.STATUS_CODE}', SYSCHNG_REMARK = N'${DATA.SYSCHNG_REMARK}' WHERE ${DATA.WHERE}`)
    }

    async insert_MstMatGroup(data) {
        let tableName = 'MSTMATGROUP';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.sql.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data)
            queryArray.push(result);

        } else {
            //********* update *********//
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
            queryArray.push(await this.sql.updateData(dataset))
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_CNFMATERIALS(data) {
        let tableName = 'CNFMATERIALS';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.sql.executeQuery(`SELECT MAX(CODE) + 1 FROM CNFMATERIALS`);
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data)
            queryArray.push(result);

        } else {
            //********* update *********//
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
            queryArray.push(await this.sql.updateData(dataset))
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_MstMatLocation(data) {
        let tableName = 'MSTMATLOCATION';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.sql.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data)
            queryArray.push(result);

        } else {
            //********* update *********//
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
            queryArray.push(await this.sql.updateData(dataset))
        }
        return await this.sql.executeInsertQuery(queryArray);
    }
    async insert_CnfRateExcise(data) {
        let tableName = 'CNFRATEEXCISE';
        let queryArray = new Array();

        console.log(data);
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.sql.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',7,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            console.log(data);

            let result = await this.sql.insertData(data)
            queryArray.push(result);

        } else {
            //********* update *********//
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
            queryArray.push(await this.sql.updateData(dataset))
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
                //********* insert *********//

                item['tableName'] = tableName;
                console.log(item);

                let result = await this.sql.insertData(item)
                queryArray.push(result);

            } else {
                //********* update *********//
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
                queryArray.push(await this.sql.updateData(dataset))
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
            //********* insert *********//
            data['tableName'] = tableName;
            // let a = await this.sql.executeQuery(`Get_Next_Master_Code '101','MSTACCTGL','GL_ACNO',9,'0'`)
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.sql.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'GL_ACNO',9,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['GL_ACNO'] = a[0][''];
            console.log(data);

            let result = await this.sql.insertData(data)
            queryArray.push(result);

        } else {
            //********* update *********//
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
            queryArray.push(await this.sql.updateData(dataset))
        }

        return await this.sql.executeInsertQuery(queryArray);
    }

    async Ins_ItarMaster(data: any) {
        let tableName = data.TABLE_NAME;
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.sql.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'CODE',5,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data)
            queryArray.push(result);

        } else {
            //********* update *********//
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
            queryArray.push(await this.sql.updateData(dataset))
        }

        return await this.sql.executeInsertQuery(queryArray);
    }

    async insert_MstMSTCOMMGODOWN(data) {
        let tableName = 'MSTCOMMGODOWN';
        let queryArray = new Array();
        if (data.CODE == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.sql.executeQuery(`Get_Next_Master_Code '101',${tableName},'CODE',6,'${prefix[0]['TYPE_CODE']}'`)
            // let a = await this.sql.executeQuery(
            //     `select coalesce (max(CODE), 400) + 1 from MSTCOMMGODOWN where CODE > 399`,
            // ); //---- new sub loactions insert from 400
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            let result = await this.sql.insertData(data)
            queryArray.push(result);

        } else {
            //********* update *********//
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
            queryArray.push(await this.sql.updateData(dataset))
        }
        return await this.sql.executeInsertQuery(queryArray);
    }

    // *********************** insert and update Masters  ************************//
    async insert_glsubgl(data) {
        let tableName = 'MSTACCTGLSUB';
        let queryArray = new Array();

        if (data.SUB_GLACNO == undefined) {
            //********* insert *********//
            let prefix = await this.MSTDocWiseNevigation({
                menu_doc_no: data.MenuDocNo,
            });

            let a = await this.sql.executeQuery(
                `Get_Next_Master_Code '101',${tableName},'SUB_GLACNO',9,'${prefix[0]['TYPE_CODE']}'`,
            );
            data['SUB_GLACNO'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;

            let result = await this.sql.insertData(data)
            queryArray.push(result);

            if (data.hasOwnProperty('MSTACCTGLSUBDETAILS')) {
                let MSTACCTGLSUBDETAILS = data.MSTACCTGLSUBDETAILS;
                MSTACCTGLSUBDETAILS["SUB_GLACNO"] = a[0][''];
                MSTACCTGLSUBDETAILS["tableName"] = "MSTACCTGLSUBDETAILS";
                let result = await this.sql.insertData(MSTACCTGLSUBDETAILS)
                queryArray.push(result);
            }
        } else {
            //********* update *********//
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
            queryArray.push(await this.sql.updateData(dataset))
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
                queryArray.push(await this.sql.updateData(dataset))
            }
        }

        return await this.sql.executeInsertQuery(queryArray);

    }

    async chckDuplicateChllnNO(data) {
        let object = {
            name: 'Sel_ChallensOfGRNMAIN',
            params: [data.COMPANY_ID, data.SUB_GLCODE]
        }
        return this.sql.execSpWithParams(object)
    }
    async getPostKeyData() {
        return await this.sql.executeQuery(`select * from CNFMATRIX order by CODE`)
    }

    //Get GST Category Data
    async getGstCategoryData() {
        let date = moment().format('YYYYMMDD');
        let object = {
            name: 'Sel_CNFRATEGST',
            params: [date, 0]
        }
        return await this.sql.execSpWithParams(object);
    }
    //-----* Get Constant Account Data
    async getConstantAccount(data) {
        return await this.sql.executeQuery(`select * from MSTACCTCONST where CODE = ${data.CODE}`)
    }
    //------------* Get Material Details
    async getMaterialDetails(data) {
        let object = {
            name: 'Sel_GetMaterialsGSTList',
            params: [data.materialType, `'${data.chrWhereClause}'`, `''`]
        }
        return await this.sql.execSpWithParams(object);
    }

    async getPostKeyDataIdWise(data) {
        // return await this.config.executeQuery(`select * from CNFMATRIXDETAIL where CODE = ${data.code} order by SRNO asc`)
        let result = await this.sql.executeQuery(`Sel_CNFMATRIXDETAIL ${data.code}, ${data.type}`)
        // console.log(result);
        return result;
    }

    async Sel_TransactionsFinance(data) {
        let object = {
            name: 'Sel_TransactionsFinance',
            params: [data.CompanyID, data.TranType, data.UserId, data.FromDate, data.ToDate,]
        }
        console.log(object)
        return await this.sql.execSpWithParams(object,);
    }


    async Sel_ControlAcctGl(data) {
        let object = {
            name: 'Sel_ControlAcctGl',
            params: [data.SUBGLCode]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }

    async Ins_LedgerControlAcc(data: any) {
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);

        let queryArray: any = [];
        let MSTACCTGLSUBGL: any = data.MSTACCTGLSUBGL;

        for (let index = 0; index < MSTACCTGLSUBGL.length; index++) {
            let item: any = MSTACCTGLSUBGL[index];
            if (index == 0) {
                queryArray.push(`DELETE FROM MSTACCTGLSUBGL WHERE SUBGL_CODE = ${item.SUBGL_CODE}`);
            }
            let temp: any = await this.config.executeQuery(`SELECT * FROM MSTACCTGLSUBGL WHERE SUBGL_CODE = ${item.SUBGL_CODE} AND GL_ACNO = ${item.GL_ACNO}`);
            if (temp.length > 0) {
                item['SYSADD_DATETIME'] = temp[0]['SYSADD_DATETIME'];
                item['SYSADD_LOGIN'] = temp[0]['SYSADD_LOGIN'];
            } else {
                item['SYSADD_DATETIME'] = sysDate[0][''];
            }
            item['SYSCHNG_DATETIME'] = sysDate[0][''];
            item['SYSCHNG_LOGIN'] = item['SYSADD_LOGIN'];

            item["tableName"] = "MSTACCTGLSUBGL"
            queryArray.push(await this.sql.insertData(item));
        }

        return await this.config.executeInsertQuery(queryArray);

    }

    async Sel_ReportHelp(data) {
        let object = {
            name: 'Sel_ReportHelp',
            params: [data.CompanyId, data.TypeList, data.SubType]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }
    async Sel_ReportLinking(data) {
        let object = {
            name: 'Sel_ReportLinking',
            params: [data.CompanyId, data.ReportCode, data.CODE]
        }
        console.log(object)
        return await this.config.execSpWithParams(object,);
    }


    async insert_CNFREPORTD(data) {
        let tableName = 'CNFREPORTD';
        let queryArray = new Array();
        queryArray.push(`DELETE CNFREPORTD WHERE REPORT_CODE = ${data.CNFREPORTD[0].REPORT_CODE} AND CODE = ${data.CNFREPORTD[0].CODE}`);
        for (let item of data.CNFREPORTD) {
            item['tableName'] = tableName;
            let result = await this.config.insertData(item)
            queryArray.push(result);
        }
        return await this.config.executeInsertQuery(queryArray);


    }

    async insert_MSTACCTALLOCATION(data: any) {
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);

        let queryArray: any = [];
        let MSTACCTALLOCATION: any = data.MSTACCTALLOCATION;
        let MSTACCTALLOCATION_del: any = data.MSTACCTALLOCATION_del;

        for (let index = 0; index < MSTACCTALLOCATION.length; index++) {
            let item: any = MSTACCTALLOCATION[index];
            queryArray.push(`DELETE FROM MSTACCTALLOCATION WHERE GL_ACNO = ${item.GL_ACNO} AND AC_TYPE = ${item.AC_TYPE}`);
            let temp: any = await this.config.executeQuery(`SELECT * FROM MSTACCTALLOCATION WHERE GL_ACNO = ${item.GL_ACNO} AND AC_TYPE = ${item.AC_TYPE}`);
            if (temp.length > 0) {
                item['SYSADD_DATETIME'] = temp[0]['SYSADD_DATETIME'];
                item['SYSADD_LOGIN'] = temp[0]['SYSADD_LOGIN'];
            } else {
                item['SYSADD_DATETIME'] = sysDate[0][''];
            }
            item['SYSCHNG_DATETIME'] = sysDate[0][''];
            item['SYSCHNG_LOGIN'] = item['SYSADD_LOGIN'];

            item["SR_NO"] = 1;
            item["tableName"] = "MSTACCTALLOCATION"
            queryArray.push(await this.sql.insertData(item));
        }

        for (let index = 0; index < MSTACCTALLOCATION_del.length; index++) {
            let item: any = MSTACCTALLOCATION_del[index];
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
        // prefix not in SP when eat the insert in old site
        let tableName = 'MSTCOMMTERMS';

        if (data.CODE == undefined) {
            //********* insert *********//
            let a = await this.config.executeQuery(
                `Get_Next_Master_Code '',${tableName},'CODE',3,''`,
            );
            data['CODE'] = a[0][''];
            // data['SYS_TIME'] = moment().format('YYYYMMDD');
            data['tableName'] = tableName;
            data['SYSCHNG_DATETIME'] = sysDate[0][''];
            data['SYSADD_DATETIME'] = sysDate[0][''];
            let result = await this.config.insertData(data)
            queryArray.push(result);

            return await this.config.executeInsertQuery(queryArray);

        } else {
            //********* update *********//
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

        //********* update *********//
        for (let item of data.CNFPOSTKEYSGL) {

            // console.log(item[0].POSTKEY_CODE);
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
    //------------* Get Company Unit Details
    async GetMSTCOMPUNITSData() {
        return await this.config.executeQuery(`select * from MSTCOMPUNITS where STATUS_CODE = 0`);
    }
    async getEmployeeList() {
        return await this.config.executeQuery(`select * from MSTCOMMEMPLOYEE where STATUS_CODE = 0 order by NAME ASC`);
    }
    async getTDSCategory(data) {
        return await this.config.executeQuery(`select  CONVERT(VARCHAR(10),CODE) + '|' + CONVERT(VARCHAR(15),GL_ACNO) + '|' + CONVERT(VARCHAR(15),ISNULL(SUB_GLACNO,0)) + '|' + CONVERT(VARCHAR(10),RATE) + '|' + CONVERT(VARCHAR(10),IT_RATE) + '|' + CONVERT(VARCHAR(10),SCHARGE_RATE) + '|' + CONVERT(VARCHAR(10),CESS_RATE) + '|' + CONVERT(VARCHAR(10),HSCCESS_RATE) AS CODE, NAME, CONVERT(VARCHAR,CODE) AS TDS_CODE, APPLICABLE_FOR AS TDS_TYPE from CNFRATETDS where STATUS_CODE = 0`)
    }
    //-----* Get Date Dropdown List
    async billDateSP(data) {
        var data = await this.config.executeQuery(`exec Get_Posting_Dates @COMPANY_ID=N'101',@display_code=${data.dateCode},@days=${data.type}`);
        return data;
    }
    async GetData(data) {
        let result = await this.config.selectAll(data);
        return result;
    }

    async getCompanyInfo() {
        let data2 = {
            TableName: `'CNFCOMPANY'`,
            TableColName: `'*'`,
            Whereclause: `'COMPANY_ID = 101' `,
        };
        return await this.Get_TableFieldswithClause(data2);
    }

    async rptKacchaMalStockRegister(data: { START_DATE: string, TO_DATE: string }) {
        let query: string = `
DECLARE @startDate varchar(8) = '${data.START_DATE}';
DECLARE @toDate varchar(8) = '${data.TO_DATE}';

--------------- GRN 
SELECT 
    'GRN' AS TransactionType,
	TRNMATPOST.TRAN_NO,
	TRNACCTMATH.SHORT_NAME,
	TRNMATPOST.TRAN_DATE,dbo.FORMAT_DATE(TRNMATPOST.TRAN_DATE) AS PRN_TRANDATE,
	MAT_CODE, MSTMATERIALS.NAME AS MAT_NAME,
	QTY, TRNMATPOST.MAT_RATE,
	TRNACCTMATH.SUB_GLACNO,
	MSTACCTGLSUB.SUBGL_LONGNAME, 
	NULL AS SALE_QTY,
	NULL AS SALE_MAT_RATE, NULL AS CHIK_MASH, NULL AS LAYER_MASH, NULL AS GROWER_MASH
FROM TRNMATPOST 
	LEFT JOIN TRNACCTMATH ON TRNACCTMATH.TRAN_NO = TRNMATPOST.TRAN_NO
	LEFT JOIN MSTACCTGLSUB ON MSTACCTGLSUB.SUB_GLACNO = TRNACCTMATH.SUB_GLACNO
	LEFT JOIN MSTMATERIALS ON MSTMATERIALS.CODE = TRNMATPOST.MAT_CODE
WHERE TRNMATPOST.STATUS_CODE = 0 AND (TRNACCTMATH.TRAN_DATE BETWEEN @startDate and @toDate) 
	 AND SUBSTRING(CAST(TRNMATPOST.TRAN_NO AS VARCHAR(50)) ,8,5) = 20215 --- grn
	 AND MSTMATERIALS.MATERIAL_TYPE IN (SELECT CODE FROM CNFMATERIALS WHERE CODE IN (105,106))

UNION ALL

-------------------- Sale
SELECT 
    'SALE' AS TransactionType,
	TRNMATPOST.TRAN_NO,
	TRNACCTMATH.SHORT_NAME,
	TRNMATPOST.TRAN_DATE,dbo.FORMAT_DATE(TRNMATPOST.TRAN_DATE) AS PRN_TRANDATE,
	MAT_CODE, MSTMATERIALS.NAME AS MAT_NAME,
	NULL AS QTY, 
	NULL AS MAT_RATE,
	TRNACCTMATH.SUB_GLACNO2 AS SUB_GLACNO,
	MSTACCTGLSUB.SUBGL_LONGNAME,
	QTY AS SALE_QTY, 
	TRNMATPOST.MAT_RATE AS SALE_MAT_RATE, NULL AS CHIK_MASH, NULL AS LAYER_MASH, NULL AS GROWER_MASH
FROM TRNMATPOST 
	LEFT JOIN TRNACCTMATH ON TRNACCTMATH.TRAN_NO = TRNMATPOST.TRAN_NO
	LEFT JOIN MSTACCTGLSUB ON MSTACCTGLSUB.SUB_GLACNO = TRNACCTMATH.SUB_GLACNO2
	LEFT JOIN MSTMATERIALS ON MSTMATERIALS.CODE = TRNMATPOST.MAT_CODE
WHERE TRNMATPOST.STATUS_CODE = 0 AND (TRNACCTMATH.TRAN_DATE BETWEEN @startDate and @toDate) 
	 AND SUBSTRING(CAST(TRNMATPOST.TRAN_NO AS VARCHAR(50)) ,8,5) IN (11514,11543)--- Rokh / Udhar Vikri
	 AND MSTMATERIALS.MATERIAL_TYPE IN (SELECT CODE FROM CNFMATERIALS WHERE CODE IN (105,106, 108))

UNION ALL

--------------- Utpadan
SELECT 
    'UTPADAN' AS TransactionType,
	TRNMATPOST.TRAN_NO,
	TRNACCTMATH.SHORT_NAME,
	TRNMATPOST.TRAN_DATE,dbo.FORMAT_DATE(TRNMATPOST.TRAN_DATE) AS PRN_TRANDATE,
	MAT_CODE, MSTMATERIALS.NAME AS MAT_NAME,
	NULL AS QTY, NULL AS MAT_RATE, NULL AS SUB_GLACNO, NULL AS SUBGL_LONGNAME,
	NULL AS SALE_QTY,
	NULL AS SALE_MAT_RATE,
	CASE WHEN MAT_CODE = 1010300015 THEN QTY ELSE NULL END AS CHIK_MASH, 
	CASE WHEN MAT_CODE = 1010300014THEN QTY ELSE NULL END AS LAYER_MASH, 
	CASE WHEN MAT_CODE = 1010300012 THEN QTY ELSE NULL END AS GROWER_MASH
FROM TRNMATPOST 
	LEFT JOIN TRNACCTMATH ON TRNACCTMATH.TRAN_NO = TRNMATPOST.TRAN_NO
	LEFT JOIN MSTMATERIALS ON MSTMATERIALS.CODE = TRNMATPOST.MAT_CODE
WHERE TRNMATPOST.STATUS_CODE = 0 AND (TRNACCTMATH.TRAN_DATE BETWEEN @startDate and @toDate) 
	 AND SUBSTRING(CAST(TRNMATPOST.TRAN_NO AS VARCHAR(50)) ,8,5) IN (55025)--- Utpada
	 AND MSTMATERIALS.MATERIAL_TYPE IN (SELECT CODE FROM CNFMATERIALS WHERE CODE IN (108))

ORDER BY TRAN_DATE, TransactionType
        `;
        return await this.sql.executeQuery(query)
    }
}


