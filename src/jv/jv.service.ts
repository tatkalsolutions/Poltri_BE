import { Injectable } from '@nestjs/common';
import { BOTRNACCTMATH } from 'src/BOTrans/BOTranacctmath';
import { BOTRNACCTMATIOUTSTAND } from 'src/BOTrans/BOTranacctmatioutstand';
import { BOTRANACCTPOST } from 'src/BOTrans/BOTranacctpost';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class JvService {
    constructor(private config: SQL, private _BOTRNACCTMATH: BOTRNACCTMATH, private _BOTRANACCTPOST: BOTRANACCTPOST, private _BOTRNACCTMATIOUTSTAND: BOTRNACCTMATIOUTSTAND) { }
    // async transactionList(data) {
    //     let object = {
    //         name: 'Sel_TransactionsCattleFeed',
    //         params: [data.CompUnit, data.MenuDocNo, data.UserID, data.StartDate, data.EndDate]
    //     }

    //     return await this.config.execSpWithParams(object);
    // }

    async insertJV(data) {
        let queryArray = new Array();

        console.log(data)
        // edit case
        if (data.TRNACCTMATH.TRAN_NO) {

            //edit

            await this.config.executeQuery(`delete TRNACCTMATH where TRAN_NO = ${data.TRNACCTMATH.TRAN_NO}`);

            let headermatH = await this._BOTRNACCTMATH.insertTranAcctMatH(data.TRNACCTMATH);
            let result = await this.config.insertData(headermatH)
            queryArray.push(result);

            if (data.TRNACCTPOST) {
                if (data.TRNACCTPOST.length != 0) {

                    await this.config.executeQuery(`delete TRNACCTPOST where TRAN_NO = ${data.TRNACCTMATH.TRAN_NO}`);

                    let count = 1;
                    for (let item of data.TRNACCTPOST) {
                        item['tableName'] = 'TRNACCTPOST'
                        item['TRAN_NO'] = headermatH.TRAN_NO
                        item['SR_NO'] = count
                        item['TRAN_TYPE'] = headermatH.TRAN_TYPE
                        item['TRAN_SUBTYPE'] = headermatH.TRAN_SUBTYPE
                        item['TRAN_SERIES'] = headermatH.TRAN_SERIES
                        item['TRAN_DATE'] = headermatH.TRAN_DATE
                        item['TRANFORMAT_NO'] = headermatH.TRANFORMAT_NO
                        item['SHORT_NAME'] = headermatH.SHORT_NAME
                        item['COMPUNIT_ID'] = headermatH.COMPUNIT_ID
                        item['SYSADD_DATETIME'] = headermatH.SYSADD_DATETIME
                        item['SYSCHNG_DATETIME'] = headermatH.SYSCHNG_DATETIME
                        item['SYSADD_LOGIN'] = headermatH.SYSADD_LOGIN
                        item['SYSCHNG_LOGIN'] = headermatH.SYSCHNG_LOGIN

                        let result = await this._BOTRANACCTPOST.insertTranAcctPost(item)
                        queryArray.push(result);
                        count++
                    }
                }
            }

            if (data.TRNACCTMATIOUTSTAND) {
                if (data.TRNACCTMATIOUTSTAND.length != 0) {
                    await this.config.executeQuery(`delete TRNACCTMATIOUTSTAND where TRAN_NO = ${data.TRNACCTMATH.TRAN_NO}`);

                    let count = 1;
                    for (let item of data.TRNACCTMATIOUTSTAND) {
                        item['tableName'] = 'TRNACCTMATIOUTSTAND'
                        item['TRAN_NO'] = headermatH.TRAN_NO
                        item['SR_NO'] = count
                        item['TRAN_DATE'] = headermatH.TRAN_DATE
                        item['SYS_DATE'] = headermatH.SYSADD_DATETIME
                        item['USER_NAME'] = headermatH.SYSCHNG_LOGIN

                        let result = await this._BOTRNACCTMATIOUTSTAND.insertTranAcctMatioutstand(item)
                        queryArray.push(result);
                        count++
                    }
                }
            }

            if (data.TRNACCTMATICHQ) {

                if (data.TRNACCTMATICHQ.length != 0) {

                    await this.config.executeQuery(`delete TRNACCTMATICHQ where TRAN_NO = ${data.TRNACCTMATH.TRAN_NO}`);

                    let count = 1;
                    for (let item of data.TRNACCTMATICHQ) {
                        item['tableName'] = 'TRNACCTMATICHQ'
                        item['TRAN_NO'] = headermatH.TRAN_NO
                        item['TRAN_TYPE'] = headermatH.TRAN_TYPE
                        item['TRAN_SUBTYPE'] = headermatH.TRAN_SUBTYPE
                        item['SR_NO'] = count
                        item['TRAN_DATE'] = headermatH.TRAN_DATE
                        item['SYS_DATE'] = headermatH.SYSADD_DATETIME
                        item['USER_NAME'] = headermatH.SYSCHNG_LOGIN

                        let result = await this.config.insertData(item)
                        queryArray.push(result);
                        count++
                    }
                }
            }

            if (data.TRNACCTMATIGSTPAY) {
                if (data.TRNACCTMATIGSTPAY.length != 0) {
                    await this.config.executeQuery(`delete TRNACCTMATIGSTPAY where TRAN_NO = ${data.TRNACCTMATH.TRAN_NO}`);

                    let count = 1;
                    for (let item of data.TRNACCTMATIGSTPAY) {
                        item['tableName'] = 'TRNACCTMATIGSTPAY'
                        item['TRAN_NO'] = headermatH.TRAN_NO
                        item['SR_NO'] = count
                        item['TRAN_DATE'] = headermatH.TRAN_DATE
                        item['SYS_DATE'] = headermatH.SYSADD_DATETIME
                        item['USER_NAME'] = headermatH.SYSCHNG_LOGIN
                        item['COMPUNIT_ID'] = headermatH.COMPUNIT_ID
                        item['SYSADD_DATETIME'] = headermatH.SYSADD_DATETIME
                        item['SYSADD_LOGIN'] = headermatH.SYSADD_LOGIN

                        let result = await this.config.insertData(item)
                        queryArray.push(result);
                        count++
                    }
                }
            }
            await this.config.executeInsertQuery(queryArray);

        } else {
            let headermatH = await this._BOTRNACCTMATH.insertTranAcctMatH(data.TRNACCTMATH);
            let result = await this.config.insertData(headermatH)
            queryArray.push(result);
            if (data.TRNACCTPOST) {
                if (data.TRNACCTPOST.length != 0) {
                    let count = 1;
                    for (let item of data.TRNACCTPOST) {
                        item['tableName'] = 'TRNACCTPOST'
                        item['TRAN_NO'] = headermatH.TRAN_NO
                        item['SR_NO'] = count
                        item['TRAN_TYPE'] = headermatH.TRAN_TYPE
                        item['TRAN_SUBTYPE'] = headermatH.TRAN_SUBTYPE
                        item['TRAN_SERIES'] = headermatH.TRAN_SERIES
                        item['TRAN_DATE'] = headermatH.TRAN_DATE
                        item['TRANFORMAT_NO'] = headermatH.TRANFORMAT_NO
                        item['SHORT_NAME'] = headermatH.SHORT_NAME
                        item['COMPUNIT_ID'] = headermatH.COMPUNIT_ID
                        item['SYSADD_DATETIME'] = headermatH.SYSADD_DATETIME
                        item['SYSCHNG_DATETIME'] = headermatH.SYSCHNG_DATETIME
                        item['SYSADD_LOGIN'] = headermatH.SYSADD_LOGIN
                        item['SYSCHNG_LOGIN'] = headermatH.SYSCHNG_LOGIN

                        let result = await this._BOTRANACCTPOST.insertTranAcctPost(item)
                        queryArray.push(result);
                        count++
                    }
                }
            }
            if (data.TRNACCTMATIOUTSTAND) {
                if (data.TRNACCTMATIOUTSTAND.length != 0) {
                    let count = 1;
                    for (let item of data.TRNACCTMATIOUTSTAND) {
                        item['tableName'] = 'TRNACCTMATIOUTSTAND'
                        item['TRAN_NO'] = headermatH.TRAN_NO
                        item['REF_TRANNO'] = headermatH.TRAN_NO
                        item['SR_NO'] = count
                        item['TRAN_DATE'] = headermatH.TRAN_DATE
                        item['SYS_DATE'] = headermatH.SYSADD_DATETIME
                        item['USER_NAME'] = headermatH.SYSCHNG_LOGIN

                        let result = await this._BOTRNACCTMATIOUTSTAND.insertTranAcctMatioutstand(item)
                        queryArray.push(result);
                        count++
                    }
                }
            }
            if (data.TRNACCTMATICHQ) {
                if (data.TRNACCTMATICHQ.length != 0) {
                    let count = 1;
                    for (let item of data.TRNACCTMATICHQ) {
                        item['tableName'] = 'TRNACCTMATICHQ'
                        item['TRAN_NO'] = headermatH.TRAN_NO
                        item['TRAN_TYPE'] = headermatH.TRAN_TYPE
                        item['TRAN_SUBTYPE'] = headermatH.TRAN_SUBTYPE
                        item['SR_NO'] = count
                        item['TRAN_DATE'] = headermatH.TRAN_DATE
                        item['SYS_DATE'] = headermatH.SYSADD_DATETIME
                        item['USER_NAME'] = headermatH.SYSCHNG_LOGIN

                        let result = await this.config.insertData(item)
                        queryArray.push(result);
                        count++
                    }
                }
            }
            if (data.TRNACCTMATIGSTPAY) {
                if (data.TRNACCTMATIGSTPAY.length != 0) {
                    let count = 1;
                    for (let item of data.TRNACCTMATIGSTPAY) {
                        item['tableName'] = 'TRNACCTMATIGSTPAY'
                        item['TRAN_NO'] = headermatH.TRAN_NO
                        item['SR_NO'] = count
                        item['TRAN_DATE'] = headermatH.TRAN_DATE
                        item['SYS_DATE'] = headermatH.SYSADD_DATETIME
                        item['USER_NAME'] = headermatH.SYSCHNG_LOGIN
                        item['COMPUNIT_ID'] = headermatH.COMPUNIT_ID
                        item['SYSADD_DATETIME'] = headermatH.SYSADD_DATETIME
                        item['SYSADD_LOGIN'] = headermatH.SYSADD_LOGIN

                        let result = await this.config.insertData(item)
                        queryArray.push(result);
                        count++
                    }
                }
            }

            let res = { TRANFORMAT_NO: headermatH.TRANFORMAT_NO }
            await this.config.executeInsertQuery(queryArray);

            return res
        }
    }
    // async insertKachamalTapasni1(data){
    //     let queryArray = new Array();

    //     let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
    //     let SR_NO

    //     let dsHeader = data.TRNCFEEDQCMSTESTH
    //     if (data.TRNCFEEDQCMSTESTH.TRAN_NO) {
    //         queryArray.push(`exec Del_TabelData @TABLE_NAME='TRNCFEEDQCMSTESTH ',@WHERECLAUSE=N' TRAN_NO = ${data.TRNCFEEDQCMSTESTH.TRAN_NO}'`);
    //         queryArray.push(`exec Del_TabelData @TABLE_NAME='TRNCFEEDQCMSTESTI ',@WHERECLAUSE=N' TRAN_NO = ${data.TRNCFEEDQCMSTESTH.TRAN_NO}'`);
    //         queryArray.push(`exec Del_TabelData @TABLE_NAME='TRNACCTMATSTATUS ',@WHERECLAUSE=N' TRAN_NO = ${data.TRNCFEEDQCMSTESTH.TRAN_NO}'`);


    //         dsHeader['TRAN_NO'] = data.TRNCFEEDQCMSTESTH.TRAN_NO
    //         dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
    //         dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //         dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
    //         dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //         dsHeader['tableName'] = 'TRNCFEEDQCMSTESTH';
    //         dsHeader['REF_SRNO'] = 1;

    //         let result = await this.config.insertData(dsHeader)
    //         queryArray.push(result);

    //         if(data.TRNCFEEDQCMSTESTI){
    //           SR_NO=1
    //           for(let item of data.TRNCFEEDQCMSTESTI){
    //               if (item.TEST_CODE!=0){
    //                   item['SR_NO'] = SR_NO;
    //                   item['REF_SRNO'] = 1;
    //                   item.REF_TRANNO = data.TRNCFEEDQCMSTESTH.REF_TRANNO
    //                   item['TRAN_NO'] =data.TRNCFEEDQCMSTESTH.TRAN_NO
    //                   item['SYSADD_DATETIME'] = sysDate[0][''];
    //                   item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //                   item['SYSCHNG_DATETIME'] = sysDate[0][''];
    //                   item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //                   item['tableName'] = 'TRNCFEEDQCMSTESTI';

    //                   let result = await this.config.insertData(item)
    //                   queryArray.push(result);
    //                   SR_NO++
    //               }
    //           }
    //         }
    //         if(data.TRNACCTMATSTATUS){
    //         //   for(let item of data.TRNACCTMATSTATUS){
    //               data.TRNACCTMATSTATUS['TRAN_NO'] = data.TRNCFEEDQCMSTESTH.TRAN_NO;
    //               data.TRNACCTMATSTATUS['SR_NO'] = 1;
    //               data.TRNACCTMATSTATUS['REF_SRNO'] = 1;
    //               data.TRNACCTMATSTATUS['SYSADD_DATETIME'] = sysDate[0][''];
    //               data.TRNACCTMATSTATUS['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //               data.TRNACCTMATSTATUS['SYSCHNG_DATETIME'] = sysDate[0][''];
    //               data.TRNACCTMATSTATUS['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //               data.TRNACCTMATSTATUS['tableName'] = 'TRNACCTMATSTATUS';

    //               let result = await this.config.insertData(data.TRNACCTMATSTATUS)
    //               queryArray.push(result);
    //         //   }
    //         }

    //         if(data.TRNCFEEDQCMSTESTH.STATUS_CODE == 0){
    //             let query = `update TRNACCTMATSTATUS set INSP_STATUS = 2 where TRAN_NO = ${data.TRNCFEEDQCMSTESTH.REF_TRANNO} and MAT_CODE = ${data.TRNCFEEDQCMSTESTH.MAT_CODE}`;
    //             queryArray.push(query);
    //         }
    //      await this.config.executeInsertQuery(queryArray);
    //       return {'TRAN_NO': data.TRNCFEEDQCMSTESTH.TRAN_NO}
    //     } else {
    //         let object = {
    //             name: 'Get_Next_Trans_No',
    //             params: [
    //               dsHeader.COMPANY_ID,
    //               dsHeader.TRAN_TYPE,
    //               dsHeader.TRAN_SUBTYPE,
    //               dsHeader.TRAN_SERIES,
    //               dsHeader.TRAN_DATE,
    //               'TRNCFEEDQCMSTESTH',
    //             ],
    //           };

    //           let TRANNO = await this.config.execSpWithParams(object);
    //           console.log(TRANNO);

    //           dsHeader['TRAN_NO'] = TRANNO[0][''];
    //           dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
    //           dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //           dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
    //           dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //           dsHeader['tableName'] = 'TRNCFEEDQCMSTESTH';
    //           dsHeader['REF_SRNO'] = 1;

    //           let result = await this.config.insertData(dsHeader)
    //           queryArray.push(result);

    //           if(data.TRNCFEEDQCMSTESTI){
    //             SR_NO=1
    //             for(let item of data.TRNCFEEDQCMSTESTI){
    //                 if (item.TEST_CODE!=0){
    //                     item['SR_NO'] = SR_NO;
    //                     item['TRAN_NO'] = TRANNO[0]['']; 
    //                     item['SYSADD_DATETIME'] = sysDate[0][''];
    //                     item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //                     item['SYSCHNG_DATETIME'] = sysDate[0][''];
    //                     item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //                     item['tableName'] = 'TRNCFEEDQCMSTESTI';

    //                     let result = await this.config.insertData(item)
    //                     queryArray.push(result);
    //                     SR_NO++
    //                 }
    //             }
    //           }
    //         //   if(data.TRNACCTMATSTATUS){
    //         //     for(let item of data.TRNACCTMATSTATUS){
    //                 data.TRNACCTMATSTATUS['TRAN_NO'] = TRANNO[0][''];
    //                 data.TRNACCTMATSTATUS['SR_NO'] = 1;
    //                 data.TRNACCTMATSTATUS['REF_SRNO'] = 1;
    //                 data.TRNACCTMATSTATUS['SYSADD_DATETIME'] = sysDate[0][''];
    //                 data.TRNACCTMATSTATUS['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //                 data.TRNACCTMATSTATUS['SYSCHNG_DATETIME'] = sysDate[0][''];
    //                 data.TRNACCTMATSTATUS['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
    //                 data.TRNACCTMATSTATUS['tableName'] = 'TRNACCTMATSTATUS';

    //                 let result1 = await this.config.insertData(data.TRNACCTMATSTATUS)
    //                 queryArray.push(result1);

    //         //     }
    //         //   }


    //         await this.config.executeInsertQuery(queryArray);
    //         return {'TRAN_NO': TRANNO[0]['']}

    //     }
    // }

}
