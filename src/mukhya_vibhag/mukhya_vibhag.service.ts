import { Injectable } from '@nestjs/common';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class MukhyaVibhagService {

  constructor(private readonly sql: SQL) { }

  // get Transaction List
  async getSmartTableData(CompUnitID, MenuDocNo, FromDate, ToDate, UserID) {
    let obj = {
      name: 'Sel_TransactionsFinance',
      params: [CompUnitID, MenuDocNo, UserID, FromDate, ToDate,],
    };

    let result = await this.sql.execSpWithParams(obj);

    return result;
  }

  async getSmartTableData2(CompUnitID, MenuDocNo, FromDate, ToDate, UserID) {
    let obj = {
      name: 'Sel_TransactionsFinance',
      params: [CompUnitID, MenuDocNo, UserID, FromDate, ToDate,],
    };

    let result = await this.sql.execSpWithParams(obj, 1);

    return result;
  }

  async insMaterialStockOpeningBalance(data) {
    let queryArray = new Array();

    let Htable
    let Itable
    let MSTMATVALRATETable
    let TRNBIPRODMATPOSTtable
    switch (data.TRNACCTMATH.COMPANY_ID) {
      case '104':
        Itable = 'TRNCFEEDSTOREMATI '

        Htable = 'TRNCFEEDMATH'
        TRNBIPRODMATPOSTtable = 'TRNCFEEDMATPOST'
        MSTMATVALRATETable = 'MSTMATVALRATE'
        break;
      case '105':
        Itable = 'TRNPUMPSTOREMATI '

        Htable = 'TRNPUMPMATH'
        TRNBIPRODMATPOSTtable = 'TRNPUMPMATPOST'
        MSTMATVALRATETable = 'MSTMATVALRATE'

        break;

      case '106':
        Itable = 'TRNCMEDSTOREMATI'

        Htable = 'TRNCMEDMATH'
        TRNBIPRODMATPOSTtable = 'TRNCMEDMATPOST'
        MSTMATVALRATETable = 'MSTMATVALRATE'
        break;
      case '101':
        Itable = 'TRNSTOREMATI'

        Htable = 'TRNACCTMATH'
        TRNBIPRODMATPOSTtable = 'TRNMATPOST'
        MSTMATVALRATETable = 'MSTMATVALRATE'
        break;
      case '103':
        Htable = 'TRNDSTORMATH'
        MSTMATVALRATETable = 'MSTMATVALRATE'
        TRNBIPRODMATPOSTtable = 'TRNDSTORMATPOST'
        Itable = 'TRNDSTORSTOREMATI'

        break;
      case '107':
        Htable = 'TRNBIPRODMATH'
        MSTMATVALRATETable = 'MSTMATVALRATE'
        TRNBIPRODMATPOSTtable = 'TRNBIPRODMATPOST'
        Itable = 'TRNBIPRODSTOREMATI'

        break;
    }
    let SR_NO = 0
    if (data.TRNACCTMATH.TRAN_NO != undefined) {
      queryArray.push(`delete from ${Htable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      queryArray.push(`delete from ${MSTMATVALRATETable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      queryArray.push(`delete from ${TRNBIPRODMATPOSTtable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      queryArray.push(`delete from ${Itable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      let sysDate = await this.sql.executeQuery(`Get_SYSDATETIME`);




      if (data.TRNACCTMATH) {
        data.TRNACCTMATH['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO
        // data.TRNACCTMATH['REF_TRANNO'] = autoIncremented[0][''];
        data.TRNACCTMATH['SYSADD_DATETIME'] = data.TRNACCTMATH.SYSADD_DATETIME;
        data.TRNACCTMATH['SYSCHNG_DATETIME'] = sysDate[0][''];
        data.TRNACCTMATH['tableName'] = Htable;
        let res = await this.sql.insertData(data.TRNACCTMATH)
        queryArray.push(res)
      }
      if (data.TRNSTOREMATI) {
        let sr_no_: number = 1;
        for (let item of data.TRNSTOREMATI) {
          item['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO
          // item['REF_TRANNO'] = autoIncremented[0][''],
          item['SYSADD_DATETIME'] = data.TRNACCTMATH.SYSADD_DATETIME;
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = Itable
          item['SR_NO'] = sr_no_;
          let res1 = await this.sql.insertData(item)
          queryArray.push(res1)
          sr_no_++;

          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO
          item['REF_TRANNO'] = data.TRNACCTMATH.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNACCTMATH.SYSADD_DATETIME;
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = MSTMATVALRATETable;
          let res2 = await this.sql.insertData(item)
          queryArray.push(res2)
        }
      }
      if (data.MSTMATVALRATE) {
        SR_NO = 0
        for (let item of data.MSTMATVALRATE) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO
          item['REF_TRANNO'] = data.TRNACCTMATH.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNACCTMATH.SYSADD_DATETIME;
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = MSTMATVALRATETable;
          let res3 = await this.sql.insertData(item)
          queryArray.push(res3)
        }
      }

      if (data.TRNMATPOST) {
        SR_NO = 0
        let REF_SRNO = 0
        for (let item of data.TRNMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['REF_SRNO'] = REF_SRNO;
          item['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO
          item['REF_TRANNO'] = data.TRNACCTMATH.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNACCTMATH.SYSADD_DATETIME;
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = TRNBIPRODMATPOSTtable;
          let res4 = await this.sql.insertData(item)
          queryArray.push(res4)
          REF_SRNO++
        }
      }
    } else {
      let autoIncremented = await this.sql.executeQuery(`exec Get_Next_Trans_No @COMPANY_ID='${data.TRNACCTMATH.COMPANY_ID}',@voutype='${data.TRNACCTMATH.TRAN_TYPE}',@vouSubType=${data.TRNACCTMATH.TRAN_SUBTYPE},@vouseries='${data.TRNACCTMATH.TRAN_SERIES}',@effdate='${data.TRNACCTMATH.TRAN_DATE}',@TABLE_NAME='${Htable}'  `);

      let sysDate = await this.sql.executeQuery(`Get_SYSDATETIME`);
      if (data.TRNACCTMATH) {
        data.TRNACCTMATH['TRAN_NO'] = autoIncremented[0][''];
        // data.TRNACCTMATH['REF_TRANNO'] = autoIncremented[0][''];
        data.TRNACCTMATH['SYSADD_DATETIME'] = sysDate[0][''];
        data.TRNACCTMATH['SYSCHNG_DATETIME'] = sysDate[0][''];
        data.TRNACCTMATH['tableName'] = Htable;
        let res = await this.sql.insertData(data.TRNACCTMATH)
        queryArray.push(res)
      }
      if (data.TRNSTOREMATI) {
        SR_NO = 0
        for (let item of data.TRNSTOREMATI) {
          SR_NO++
          item['SR_NO'] = SR_NO,
            item['TRAN_NO'] = autoIncremented[0][''],
            // item['REF_TRANNO'] = autoIncremented[0][''],
            item['SYSADD_DATETIME'] = sysDate[0][''],
            item['SYSCHNG_DATETIME'] = sysDate[0][''],
            item['tableName'] = Itable
          let res1 = await this.sql.insertData(item)
          queryArray.push(res1)
          item['RATE'] = item.MAT_RATE;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = MSTMATVALRATETable;
          let res2 = await this.sql.insertData(item)
          queryArray.push(res2)
        }
      }
      if (data.MSTMATVALRATE) {
        SR_NO = 0
        for (let item of data.MSTMATVALRATE) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = MSTMATVALRATETable;
          let res3 = await this.sql.insertData(item)
          queryArray.push(res3)
        }
      }

      if (data.TRNMATPOST) {
        SR_NO = 0
        let REF_SRNO = 0
        for (let item of data.TRNMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['REF_SRNO'] = REF_SRNO;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = TRNBIPRODMATPOSTtable;
          let res4 = await this.sql.insertData(item)
          queryArray.push(res4)
          REF_SRNO++
        }
      }

    }
    return await this.sql.executeInsertQuery(queryArray);
  }

  async mukhyaVibhagInsert(dsHeader, dsFINAcPost, dsRefHeader, dsRefACPost) {
    let queryArray = new Array();

    // console.log('res2',dsHeader, dsFINAcPost);
    let TRAN_NO: number = dsHeader.TRAN_NO;
    let RefTranNo = 0;
    let ex_SYSADD_LOGIN = dsHeader.SYSADD_LOGIN;
    let ex_SYSADD_DATETIME = dsHeader.SYSADD_DATETIME;

    if (TRAN_NO != undefined) {
      await this.sql.executeQuery(
        `delete from TRNACCTMATH where TRAN_NO= ${dsHeader.TRAN_NO}`,
      );
      await this.sql.executeQuery(
        `delete from TRNACCTPOST where TRAN_NO= ${dsHeader.TRAN_NO}`,
      );

      dsHeader['TRAN_NO'] = TRAN_NO;
      dsHeader['REFCOMPUNIT_ID'] = dsHeader.REFUNIT_ID;
      dsHeader['REFCOMPUNIT_TRANNO'] = dsHeader.REFUNIT_TRANNO;
      dsHeader['SYSADD_DATETIME'] = ex_SYSADD_DATETIME;
      dsHeader['SYSADD_LOGIN'] = ex_SYSADD_LOGIN;
      dsHeader['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
      dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
      dsHeader['tableName'] = 'TRNACCTMATH';

      //Insert into TRNACCTMATH
      let res = await this.sql.insertData(dsHeader);
      queryArray.push(res);

      //---------* Material details table details
      if (dsFINAcPost.length != 0) {
        let SR_NO = 1;
        for (let item of dsFINAcPost) {
          item['TRAN_NO'] = TRAN_NO;
          item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
          item['TRAN_DATE'] = dsHeader.TRAN_DATE;
          // item['GODOWN_CODE'] = dsHeader.GODOWN_CODE;
          item['SYSADD_DATETIME'] = ex_SYSADD_DATETIME;
          item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
          item['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
          item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
          item['SR_NO'] = SR_NO;
          item['STATUS_CODE'] = dsHeader.STATUS_CODE;
          item['tableName'] = 'TRNACCTPOST';

          let res1 = await this.sql.insertData(item);
          queryArray.push(res1);
          SR_NO++;
        }
      }
    } else {
      let sysDate = await this.sql.executeQuery(`Get_SYSDATETIME`);

      let object = {
        name: 'Get_Next_Trans_No',
        params: [
          dsHeader.COMPANY_ID,
          dsHeader.TRAN_TYPE,
          dsHeader.TRAN_SUBTYPE,
          dsHeader.TRAN_SERIES,
          dsHeader.TRAN_DATE,
          'TRNACCTMATH',
        ],
      };
      let TRANNO = await this.sql.execSpWithParams(object);
      if (dsRefACPost != undefined) {
        if (Object.keys(dsRefACPost).length != 0) {
          let object1 = {
            name: 'Get_Next_Trans_No',
            params: [
              dsRefHeader.COMPANY_ID == undefined ? dsRefHeader.COMPUNIT_ID : dsRefHeader.COMPANY_ID,
              dsRefHeader.TRAN_TYPE,
              dsRefHeader.TRAN_SUBTYPE,
              dsRefHeader.TRAN_SERIES,
              dsRefHeader.TRAN_DATE,
              'TRNACCTMATH',
            ],
          };

          let getRefTranNo = await this.sql.execSpWithParams(object1);
          RefTranNo = getRefTranNo[0][''];
        }
      }

      dsHeader['TRAN_NO'] = TRANNO[0][''];
      dsHeader['REFCOMPUNIT_TRANNO'] = RefTranNo;
      dsHeader['REFCOMPUNIT_ID'] = dsHeader?.REFCOMPUNIT_ID == undefined ? 0 : dsRefHeader?.COMPANY_ID;
      // dsHeader['REFCOMPUNIT_ID'] = 0;
      dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
      dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
      dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
      dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
      dsHeader['tableName'] = 'TRNACCTMATH';

      //Insert into TRNACCTMATH
      let res = await this.sql.insertData(dsHeader);
      queryArray.push(res);

      //---------* Material details table details
      if (dsFINAcPost.length != 0) {
        let SR_NO = 1;
        for (let item of dsFINAcPost) {
          item['TRAN_NO'] = dsHeader.TRAN_NO;
          item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
          item['TRAN_DATE'] = dsHeader.TRAN_DATE;
          // item['GODOWN_CODE'] = dsHeader.GODOWN_CODE;
          item['SYSADD_DATETIME'] = dsHeader.SYSADD_DATETIME;
          item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
          item['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
          item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
          item['SR_NO'] = SR_NO;
          item['STATUS_CODE'] = dsHeader.STATUS_CODE;
          item['tableName'] = 'TRNACCTPOST';

          let res1 = await this.sql.insertData(item);
          queryArray.push(res1);
          SR_NO++;
        }
      }

      // for second TRNACCTMATH table object
      if (dsRefACPost != undefined) {
        if (Object.keys(dsRefACPost)?.length != 0) {
          dsRefHeader['TRAN_NO'] = RefTranNo;
          dsRefHeader['REFCOMPUNIT_TRANNO'] = TRANNO[0][''];
          dsRefHeader['GL_ACNO'] = dsHeader.GL_ACNO;
          dsRefHeader['SUB_GLACNO'] = dsHeader.SUB_GLACNO;
          dsRefHeader['COMPUNIT_ID'] = dsRefHeader.COMPANY_ID;
          dsRefHeader['REFCOMPUNIT_ID'] = dsHeader.COMPANY_ID;
          dsRefHeader['SYSADD_DATETIME'] = sysDate[0][''];
          dsRefHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
          dsRefHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
          dsRefHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
          dsRefHeader['tableName'] = 'TRNACCTMATH';
          let res2 = await this.sql.insertData(dsRefHeader);
          queryArray.push(res2);

          if (Object.keys(dsRefACPost)?.length != 0) {
            let SR_NO = 1;
            for (let item of dsRefACPost) {
              item['TRAN_NO'] = dsRefHeader.TRAN_NO;
              item['TRAN_SUBTYPE'] = dsRefHeader.TRAN_SUBTYPE;
              item['TRAN_DATE'] = dsRefHeader.TRAN_DATE;
              item['SYSADD_DATETIME'] = sysDate[0][''];
              item['SR_NO'] = SR_NO;
              item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
              item['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
              item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
              item['STATUS_CODE'] = dsRefHeader.STATUS_CODE;
              item['tableName'] = 'TRNACCTPOST';
              let res3 = await this.sql.insertData(item);
              queryArray.push(res3);
              SR_NO++;
            }
          }
        }
      }
    }

    return await this.sql.executeInsertQuery(queryArray);
  }
  async getExistingTransactionData(data) {
    console.log(data);
    let obj;
    // exec Sel_ExistingTransactionsDairy @bintTranNo=101192020112000135,@intTranSubType=2,@intAmendNo=0
    if (data.TRAN_NO != undefined && data.TRAN_SUBTYPE != undefined) {
      obj = {
        name: 'Sel_ExistingTransactionsFinance',
        params: [data.TRAN_NO, data.TRAN_SUBTYPE, 0],
      };
    } else {
      obj = {
        name: 'Sel_ExistingTransactionsFinance',
        params: [data[0].TRAN_NO, data[0].TRAN_SUBTYPE, 0],
      };
    }
    let result = await this.sql.execSpWithParams(obj, 1);
    return result;
  }

  async mukhyaVibhagTwoObj_Insert(

    dsHeader: any,
    dsACPost: any,
    dsRefHeader?: any,
    dsRefACPost?: any,
  ) {
    let queryArray = new Array();

    let ex_RefTranNo;
    let sysDate = await this.sql.executeQuery(`Get_SYSDATETIME`);
    let RefTranNo: any = 0;
    if (dsRefHeader.hasOwnProperty('RefTranNo')) {
      ex_RefTranNo = dsRefHeader.RefTranNo;
    }
    else {
      ex_RefTranNo = dsRefHeader.REF_TRANNO;
    }
    let TRAN_NO: number = dsHeader.TRAN_NO;
    let ex_SYSADD_LOGIN = dsHeader.SYSADD_LOGIN;
    let ex_SYSADD_DATETIME = dsHeader.SYSADD_DATETIME;

    if (TRAN_NO != undefined) {
      await this.sql.executeQuery(`delete from TRNACCTMATH where TRAN_NO= ${dsHeader.TRAN_NO} `)

      // await this.sql.executeQuery(
      //   `delete from TRNACCTMATH where TRAN_NO= ${dsHeader.TRAN_NO}`,
      // );
      await this.sql.executeQuery(
        `delete from TRNACCTPOST where TRAN_NO= ${dsHeader.TRAN_NO}`,
      );

      if (Object.keys(dsRefHeader).length != 0) {
        dsRefHeader['TRAN_NO'] = ex_RefTranNo;
        dsRefHeader['REFUNIT_TRANNO'] = TRAN_NO;
        dsRefHeader['SYSADD_DATETIME'] = ex_SYSADD_LOGIN;
        dsRefHeader['SYSADD_LOGIN'] = ex_SYSADD_LOGIN;
        dsRefHeader['SYSCHNG_DATETIME'] = dsRefHeader.SYSCHNG_DATETIME;
        dsRefHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsRefHeader['tableName'] = 'TRNACCTMATH';
        let res = await this.sql.insertData(dsRefHeader);
        queryArray.push(res);
      } else {
        dsHeader['TRAN_NO'] = TRAN_NO;
        dsHeader['REFUNIT_TRANNO'] = RefTranNo;
        dsHeader['SYSADD_DATETIME'] = ex_SYSADD_DATETIME;
        dsHeader['SYSADD_LOGIN'] = ex_SYSADD_LOGIN;
        dsHeader['SYSCHNG_DATETIME'] = dsHeader.SYSCHNG_DATETIME;
        dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['tableName'] = 'TRNACCTMATH';
        let res = await this.sql.insertData(dsHeader);
        queryArray.push(res);

      }



      let SR_NO = 1;
      for (let item of dsACPost) {
        item['TRAN_NO'] = TRAN_NO;
        item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
        item['TRAN_DATE'] = dsHeader.TRAN_DATE;
        item['SYSADD_DATETIME'] = ex_SYSADD_DATETIME;
        item['SYSADD_LOGIN'] = ex_SYSADD_LOGIN;
        item['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
        item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        item['STATUS_CODE'] = dsHeader.STATUS_CODE;
        item['SR_NO'] = SR_NO;
        item['tableName'] = 'TRNACCTPOST';

        let res1 = await this.sql.insertData(item);
        queryArray.push(res1);
        SR_NO++;
      }

      if (Object.keys(dsRefACPost).length != 0) {
        dsRefACPost['TRAN_NO'] = ex_RefTranNo;
        dsRefACPost['TRAN_SUBTYPE'] = dsRefHeader.TRAN_SUBTYPE;
        dsRefACPost['TRAN_DATE'] = dsRefHeader.TRAN_DATE;
        dsRefACPost['SYSADD_DATETIME'] = ex_SYSADD_DATETIME;
        dsRefACPost['SYSADD_LOGIN'] = ex_SYSADD_LOGIN;
        dsRefACPost['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
        dsRefACPost['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsRefACPost['STATUS_CODE'] = dsRefHeader.STATUS_CODE;
        dsRefACPost['tableName'] = 'TRNACCTPOST';

        let res2 = await this.sql.insertData(dsRefACPost);
        queryArray.push(res2);
      }
    } else {
      let object = {
        name: 'Get_Next_Trans_No',
        params: [
          dsHeader.COMPANY_ID,
          dsHeader.TRAN_TYPE,
          dsHeader.TRAN_SUBTYPE,
          dsHeader.TRAN_SERIES,
          dsHeader.TRAN_DATE,
          'TRNACCTMATH',
        ],
      };
      let TRANNO = await this.sql.execSpWithParams(object);

      if (Object.keys(dsRefHeader).length != 0) {
        let object1 = {
          name: 'Get_Next_Trans_No',
          params: [
            dsRefHeader.COMPANY_ID == undefined ? dsRefHeader.COMPUNIT_ID : dsRefHeader.COMPANY_ID,
            dsRefHeader.TRAN_TYPE,
            dsRefHeader.TRAN_SUBTYPE,
            dsRefHeader.TRAN_SERIES,
            dsRefHeader.TRAN_DATE,
            'TRNACCTMATH',
          ],
        };

        let getRefTranNo = await this.sql.execSpWithParams(object1);
        RefTranNo = getRefTranNo[0][''];
      }

      dsHeader['TRAN_NO'] = TRANNO[0][''];
      dsHeader['REFCOMPUNIT_TRANNO'] = RefTranNo;
      dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
      dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
      dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
      dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
      dsHeader['tableName'] = 'TRNACCTMATH';
      let res = await this.sql.insertData(dsHeader);
      queryArray.push(res);

      let SR_NO = 1;
      for (let item of dsACPost) {
        item['TRAN_NO'] = dsHeader.TRAN_NO;
        item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
        item['TRAN_DATE'] = dsHeader.TRAN_DATE;
        item['SYSADD_DATETIME'] = dsHeader.SYSADD_DATETIME;
        item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        item['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
        item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        item['STATUS_CODE'] = dsHeader.STATUS_CODE;
        item['TRAN_AMT'] = item.TRAN_AMT == undefined ? item.TRAN_AMOUNT : item.TRAN_AMT;
        item['SR_NO'] = SR_NO;
        item['tableName'] = 'TRNACCTPOST';
        let res1 = await this.sql.insertData(item);
        queryArray.push(res1);
        SR_NO++;
      }

      // for second TRNACCTMATH table object
      if (Object.keys(dsRefHeader).length != 0) {
        dsRefHeader['TRAN_NO'] = RefTranNo;
        dsRefHeader['REFCOMPUNIT_TRANNO'] = TRANNO[0][''];
        dsRefHeader['GL_ACNO'] = dsHeader.GL_ACNO;
        dsRefHeader['GL_ACNO1'] = dsRefHeader.GL_ACNO1;
        dsRefHeader['SUB_GLACNO'] = dsHeader.SUB_GLACNO;
        dsRefHeader['COMPUNIT_ID'] = dsHeader.REFCOMPUNIT_ID;
        dsRefHeader['REFCOMPUNIT_ID'] = dsHeader.COMPANY_ID;
        dsRefHeader['SYSADD_DATETIME'] = sysDate[0][''];
        dsRefHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsRefHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
        dsRefHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsRefHeader['tableName'] = 'TRNACCTMATH';
        let res2 = await this.sql.insertData(dsRefHeader);
        queryArray.push(res2);

        if (Object.keys(dsRefACPost).length != 0) {
          let SR_NO = 1;
          for (let item of dsRefACPost) {
            item['TRAN_NO'] = dsRefHeader.TRAN_NO;
            item['TRAN_SUBTYPE'] = dsRefHeader.TRAN_SUBTYPE;
            item['TRAN_DATE'] = dsRefHeader.TRAN_DATE;
            item['SYSADD_DATETIME'] = sysDate[0][''];
            item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
            item['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
            item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
            item['STATUS_CODE'] = dsRefHeader.STATUS_CODE;
            item['SR_NO'] = SR_NO;
            item['tableName'] = 'TRNACCTPOST';
            let res3 = await this.sql.insertData(item);
            queryArray.push(res3);
            SR_NO++;
          }
        }
      }
    }
    // return dsHeader
    return await this.sql.executeInsertQuery(queryArray);

  }

  async Sel_ApprovalTransactionsFinance(data) {
    if (data.URL == 'Sel_ApprovalTransactionsFinance') {
      let obj = {
        name: 'Sel_ApprovalTransactionsFinance',
        params: [
          data.CompanyID,
          data.TranType,
          data.DocType,
          data.StatusCode,
          data.UserId,
        ],
      };
      let result = await this.sql.execSpWithParams(obj);
      return result;
    } else if (data.URL == 'Sel_PendingDemLet') {
      let obj = {
        name: 'Sel_PendingDemLet',
        params: [data.TranType],
      };
      let result = await this.sql.execSpWithParams(obj);
      return result;
    } else if (data.URL == 'Sel_ChqReturnList') {
      let obj = {
        name: 'Sel_ChqReturnList',
        params: [
          data.CompanyID,
          data.SubGLNo,
          data.StaticCode,
          data.FromDate,
          data.ToDate,
        ],
      };
      let result = await this.sql.execSpWithParams(obj);
      return result;
    } else {
      return 'data not found !';
    }
  }

  async kharchMagniVouchrInsert(
    dsHeader: any,
    dsACPost: any,
    dsRefHeader?: any,
    dsRefACPost?: any,
  ) {

    let queryArray = new Array();

    let ex_RefTranNo;
    let sysDate = await this.sql.executeQuery(`Get_SYSDATETIME`);
    let RefTranNo: any = 0;
    if (dsRefHeader.hasOwnProperty('RefTranNo')) {
      ex_RefTranNo = dsRefHeader.RefTranNo;
    }
    else {
      ex_RefTranNo = dsRefHeader.REF_TRANNO;
    }
    let TRAN_NO: number = dsHeader.TRAN_NO;
    let ex_SYSADD_LOGIN = dsHeader.SYSADD_LOGIN;
    let ex_SYSADD_DATETIME = dsHeader.SYSADD_DATETIME;

    if (TRAN_NO != undefined) {
      await this.sql.executeQuery(`delete from TRNACCTMATH where TRAN_NO= ${dsHeader.TRAN_NO} `)

      // await this.sql.executeQuery(
      //   `delete from TRNACCTMATH where TRAN_NO= ${dsHeader.TRAN_NO}`,
      // );
      await this.sql.executeQuery(
        `delete from TRNACCTPOST where TRAN_NO= ${dsHeader.TRAN_NO}`,
      );

      let object = {
        name: 'Get_Next_Trans_No',
        params: [
          dsHeader.COMPANY_ID,
          dsHeader.TRAN_TYPE,
          dsHeader.TRAN_SUBTYPE,
          dsHeader.TRAN_SERIES,
          dsHeader.TRAN_DATE,
          'TRNACCTMATH',
        ],
      };
      let TRANNO = await this.sql.execSpWithParams(object);

      if (Object.keys(dsRefHeader).length != 0) {
        let object1 = {
          name: 'Get_Next_Trans_No',
          params: [
            dsRefHeader.COMPANY_ID,
            dsRefHeader.TRAN_TYPE,
            dsRefHeader.TRAN_SUBTYPE,
            dsRefHeader.TRAN_SERIES,
            dsRefHeader.TRAN_DATE,
            'TRNACCTMATH',
          ],
        };

        let getRefTranNo = await this.sql.execSpWithParams(object1);
        RefTranNo = getRefTranNo[0][''];
      }

      if (Object.keys(dsRefHeader).length != 0) {
        dsRefHeader['TRAN_NO'] = RefTranNo;
        dsRefHeader['REFUNIT_TRANNO'] = TRANNO;
        dsRefHeader['SYSADD_DATETIME'] = ex_SYSADD_LOGIN;
        dsRefHeader['SYSADD_LOGIN'] = ex_SYSADD_LOGIN;
        dsRefHeader['SYSCHNG_DATETIME'] = dsRefHeader.SYSCHNG_DATETIME;
        dsRefHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsRefHeader['tableName'] = 'TRNACCTMATH';
        let res = await this.sql.insertData(dsRefHeader);
        queryArray.push(res);
      } else {
        dsHeader['TRAN_NO'] = TRANNO;
        dsHeader['REFUNIT_TRANNO'] = RefTranNo;
        dsHeader['SYSADD_DATETIME'] = ex_SYSADD_DATETIME;
        dsHeader['SYSADD_LOGIN'] = ex_SYSADD_LOGIN;
        dsHeader['SYSCHNG_DATETIME'] = dsHeader.SYSCHNG_DATETIME;
        dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsHeader['tableName'] = 'TRNACCTMATH';
        let res = await this.sql.insertData(dsHeader);
        queryArray.push(res);

      }

      let SR_NO = 1;
      for (let item of dsACPost) {
        item['TRAN_NO'] = TRANNO;
        item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
        item['TRAN_DATE'] = dsHeader.TRAN_DATE;
        item['SYSADD_DATETIME'] = ex_SYSADD_DATETIME;
        item['SYSADD_LOGIN'] = ex_SYSADD_LOGIN;
        item['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
        item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        item['STATUS_CODE'] = dsHeader.STATUS_CODE;
        item['SR_NO'] = SR_NO;
        item['tableName'] = 'TRNACCTPOST';
        let res1 = await this.sql.insertData(item);
        queryArray.push(res1);
        SR_NO++;
      }

      if (Object.keys(dsRefACPost).length != 0) {
        dsRefACPost['TRAN_NO'] = RefTranNo;
        dsRefACPost['TRAN_SUBTYPE'] = dsRefHeader.TRAN_SUBTYPE;
        dsRefACPost['TRAN_DATE'] = dsRefHeader.TRAN_DATE;
        dsRefACPost['SYSADD_DATETIME'] = ex_SYSADD_DATETIME;
        dsRefACPost['SYSADD_LOGIN'] = ex_SYSADD_LOGIN;
        dsRefACPost['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
        dsRefACPost['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsRefACPost['STATUS_CODE'] = dsRefHeader.STATUS_CODE;
        dsRefACPost['tableName'] = 'TRNACCTPOST';
        let res2 = await this.sql.insertData(dsRefACPost);
        queryArray.push(res2);
      }
    } else {
      let object = {
        name: 'Get_Next_Trans_No',
        params: [
          dsHeader.COMPANY_ID,
          dsHeader.TRAN_TYPE,
          dsHeader.TRAN_SUBTYPE,
          dsHeader.TRAN_SERIES,
          dsHeader.TRAN_DATE,
          'TRNACCTMATH',
        ],
      };
      let TRANNO = await this.sql.execSpWithParams(object);

      if (Object.keys(dsRefHeader).length != 0) {
        let object1 = {
          name: 'Get_Next_Trans_No',
          params: [
            dsRefHeader.COMPANY_ID,
            dsRefHeader.TRAN_TYPE,
            dsRefHeader.TRAN_SUBTYPE,
            dsRefHeader.TRAN_SERIES,
            dsRefHeader.TRAN_DATE,
            'TRNACCTMATH',
          ],
        };

        let getRefTranNo = await this.sql.execSpWithParams(object1);
        RefTranNo = getRefTranNo[0][''];
      }

      dsHeader['TRAN_NO'] = TRANNO[0][''];
      dsHeader['REFCOMPUNIT_TRANNO'] = RefTranNo;
      dsHeader['COMPUNIT_ID'] = dsHeader.COMPANY_ID;
      dsHeader['REFCOMPUNIT_ID'] = dsHeader.REFCOMPUNIT_ID;
      dsHeader['SYSADD_DATETIME'] = sysDate[0][''];
      dsHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
      dsHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
      dsHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
      dsHeader['tableName'] = 'TRNACCTMATH';
      let res = await this.sql.insertData(dsHeader);
      queryArray.push(res);

      let SR_NO = 1;
      for (let item of dsACPost) {
        item['TRAN_NO'] = dsHeader.TRAN_NO;
        item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
        item['TRAN_DATE'] = dsHeader.TRAN_DATE;
        item['SYSADD_DATETIME'] = dsHeader.SYSADD_DATETIME;
        item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        item['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
        item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        item['STATUS_CODE'] = dsHeader.STATUS_CODE;
        item['SR_NO'] = SR_NO;
        item['tableName'] = 'TRNACCTPOST';
        let res1 = await this.sql.insertData(item);
        queryArray.push(res1);
        SR_NO++;
      }

      // for second TRNACCTMATH table object
      if (Object.keys(dsRefHeader).length != 0) {
        // let object1 = {
        //   name: 'Get_Next_Trans_No',
        //   params: [
        //     dsRefHeader.COMPANY_ID,
        //     dsRefHeader.TRAN_TYPE,
        //     dsRefHeader.TRAN_SUBTYPE,
        //     dsRefHeader.TRAN_SERIES,
        //     dsRefHeader.TRAN_DATE,
        //     'TRNACCTMATH',
        //   ],
        // };

        // let getRefTranNo = await this.sql.execSpWithParams(object1);
        // RefTranNo = getRefTranNo[0][''];

        dsRefHeader['TRAN_NO'] = RefTranNo;
        dsRefHeader['REFCOMPUNIT_TRANNO'] = TRANNO[0][''];
        dsRefHeader['SUB_GLACNO'] = dsHeader.SUB_GLACNO;
        dsRefHeader['COMPUNIT_ID'] = dsRefHeader.COMPANY_ID;
        dsRefHeader['TRAN_AMT'] = dsHeader.TRAN_AMT;
        dsRefHeader['REFCOMPUNIT_ID'] = dsHeader.COMPANY_ID;
        dsRefHeader['SYSADD_DATETIME'] = sysDate[0][''];
        dsRefHeader['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsRefHeader['SYSCHNG_DATETIME'] = sysDate[0][''];
        dsRefHeader['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
        dsRefHeader['tableName'] = 'TRNACCTMATH';
        let res2 = await this.sql.insertData(dsRefHeader);
        queryArray.push(res2);

        if (Object.keys(dsRefACPost).length != 0) {
          dsRefACPost['TRAN_NO'] = dsRefHeader.TRAN_NO;
          dsRefACPost['TRAN_SUBTYPE'] = dsRefHeader.TRAN_SUBTYPE;
          dsRefACPost['TRAN_DATE'] = dsRefHeader.TRAN_DATE;
          dsRefACPost['SYSADD_DATETIME'] = sysDate[0][''];
          dsRefACPost['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
          dsRefACPost['SYSCHNG_DATETIME'] = dsHeader.SYSADD_DATETIME;
          dsRefACPost['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
          dsRefACPost['STATUS_CODE'] = dsRefHeader.STATUS_CODE;
          dsRefACPost['tableName'] = 'TRNACCTPOST';
          let res3 = await this.sql.insertData(dsRefACPost);
          queryArray.push(res3);
        }
      }
    }
    return await this.sql.executeInsertQuery(queryArray);

    // return dsHeader
  }
}
