import { Injectable } from '@nestjs/common';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class TransactionListService {
  constructor(private config: SQL) { }

  async insRequisitionSlip(data) {
    let SR_NO = 0
    let queryArray = new Array();

    if (data.TRNSTORMATHREQU.TRAN_NO != undefined) {
      queryArray.push(`delete from TRNSTORMATHREQU where TRAN_NO= ${data.TRNSTORMATHREQU.TRAN_NO} `)
      // queryArray.push(`delete from TRNCFEEDMATPOST where TRAN_NO= ${data.TRNSTORMATHREQU.TRAN_NO} `)
      queryArray.push(`delete from TRNCFEEDSTOREMATI where TRAN_NO= ${data.TRNSTORMATHREQU.TRAN_NO} `)
      queryArray.push(`delete from TRNACCTMATSTATUS where TRAN_NO= ${data.TRNSTORMATHREQU.TRAN_NO} `)
      let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);


      if (data.TRNSTORMATHREQU) {
        data.TRNSTORMATHREQU['TRAN_NO'] = data.TRNSTORMATHREQU.TRAN_NO
        data.TRNSTORMATHREQU['SYSADD_DATETIME'] = data.TRNSTORMATHREQU.SYSADD_DATETIME;
        // data.TRNSTORMATHREQU['REF_TRANNO'] = data.TRNSTORMATHREQU.TRAN_NO
        data.TRNSTORMATHREQU['SYSADD_DATETIME'] = sysDate[0][''];
        data.TRNSTORMATHREQU['SYSCHNG_DATETIME'] = sysDate[0][''];
        data.TRNSTORMATHREQU['tableName'] = 'TRNSTORMATHREQU';

        let result = await this.config.insertData(data.TRNSTORMATHREQU)
        queryArray.push(result)
      }
      if (data.TRNSTORMATIREQU) {
        for (let item of data.TRNSTORMATIREQU) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = data.TRNSTORMATHREQU.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNSTORMATHREQU.SYSADD_DATETIME;
          // item['REF_TRANNO'] = data.TRNSTORMATHREQU.TRAN_NO
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = 'TRNSTORMATIREQU';

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }

      if (data.TRNACCTMATSTATUS) {
        for (let item of data.TRNCFEEDMATPOST) {
          item['TRAN_NO'] = data.TRNSTORMATHREQU.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNSTORMATHREQU.SYSADD_DATETIME;
          // item['REF_TRANNO'] = data.TRNSTORMATHREQU.TRAN_NO
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = 'TRNACCTMATSTATUS';
          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }

    } else {
      let autoIncremented = await this.config.executeQuery(`exec Get_Next_Trans_No @COMPANY_ID='${data.TRNSTORMATHREQU.COMPANY_ID}',@voutype='${data.TRNSTORMATHREQU.TRAN_TYPE}',@vouSubType=${data.TRNSTORMATHREQU.TRAN_SUBTYPE},@vouseries='${data.TRNSTORMATHREQU.TRAN_SERIES}',@effdate='${data.TRNSTORMATHREQU.TRAN_DATE}',@TABLE_NAME='TRNSTORMATHREQU'  `);

      let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
      if (data.TRNSTORMATHREQU) {
        data.TRNSTORMATHREQU['TRAN_NO'] = autoIncremented[0][''];
        // data.TRNSTORMATHREQU['REF_TRANNO'] = autoIncremented[0][''];
        data.TRNSTORMATHREQU['SYSADD_DATETIME'] = sysDate[0][''];
        data.TRNSTORMATHREQU['SYSCHNG_DATETIME'] = sysDate[0][''];
        data.TRNSTORMATHREQU['tableName'] = 'TRNSTORMATHREQU';

        let result = await this.config.insertData(data.TRNSTORMATHREQU)
        queryArray.push(result)
      }
      // if (data.TRNCFEEDMATPOST) {
      //     for (let item of data.TRNCFEEDMATPOST) {
      //         item['TRAN_NO'] = autoIncremented[0][''],
      //             // item['REF_TRANNO'] = autoIncremented[0][''],
      //             item['SYSADD_DATETIME'] = sysDate[0][''],
      //             item['SYSCHNG_DATETIME'] = sysDate[0][''],
      //             item['tableName'] = 'TRNCFEEDMATPOST'

      //         await this.config.insertData(item)
      //     }
      // }
      if (data.TRNSTORMATIREQU) {
        SR_NO = 0
        for (let item of data.TRNSTORMATIREQU) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = autoIncremented[0][''];
          // item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = 'TRNSTORMATIREQU';

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }

      if (data.TRNACCTMATSTATUS) {
        SR_NO = 0
        let REF_SRNO = 0
        for (let item of data.TRNACCTMATSTATUS) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['REF_SRNO'] = REF_SRNO;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = 'TRNACCTMATSTATUS';
          let result = await this.config.insertData(item)
          queryArray.push(result)
          REF_SRNO++
        }
      }
    }
    return await this.config.executeInsertQuery(queryArray);
  }

  async insIssueAgslip(data) {
    let queryArray = new Array();

    let Htable
    let Ptable
    let Itable
    let Stable

    switch (data.TRNCFEEDMATH.COMPANY_ID) {
      case "104":
        Htable = 'TRNCFEEDMATH'
        Ptable = 'TRNCFEEDMATPOST'
        Itable = 'TRNCFEEDSTOREMATI'
        Stable = 'TRNACCTMATSTATUS'
        break;
      case "105":

        Htable = 'TRNPUMPMATH'
        Ptable = 'TRNPUMPMATPOST'
        Itable = 'TRNPUMPSTOREMATI'
        Stable = 'TRNACCTMATSTATUS'
        break;
      case "106":
        Htable = 'TRNCMEDMATH'
        Ptable = 'TRNCMEDMATPOST'
        Itable = 'TRNCMEDSTOREMATI'
        Stable = 'TRNACCTMATSTATUS'
        break;
      case "101":
        Htable = 'TRNACCTMATH'
        Ptable = 'TRNMATPOST'
        Itable = 'TRNSTOREMATI'
        Stable = 'TRNACCTMATSTATUS'
        break;

      case "103":
        Htable = 'TRNDSTORMATH'
        Ptable = 'TRNDSTORSTOREMATI'
        Itable = 'TRNDSTORMATPOST'
        Stable = 'TRNACCTMATSTATUS'
        break;
      case "107":
        Htable = 'TRNBIPRODMATH'
        Ptable = 'TRNBIPRODMATPOST'
        Itable = 'TRNBIPRODSTOREMATI'
        Stable = 'TRNACCTMATSTATUS'
        break;
    }




    let SR_NO = 0
    if (data.TRNCFEEDMATH.TRAN_NO != undefined) {
      queryArray.push(`delete from ${Htable} where TRAN_NO= ${data.TRNCFEEDMATH.TRAN_NO} `)
      queryArray.push(`delete from ${Ptable} where TRAN_NO= ${data.TRNCFEEDMATH.TRAN_NO} `)
      queryArray.push(`delete from ${Itable} where TRAN_NO= ${data.TRNCFEEDMATH.TRAN_NO} `)
      queryArray.push(`delete from ${Stable} where TRAN_NO= ${data.TRNCFEEDMATH.TRAN_NO} `)
      let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
      if (data.TRNCFEEDMATH) {
        data.TRNCFEEDMATH['TRAN_NO'] = data.TRNCFEEDMATH.TRAN_NO
        data.TRNCFEEDMATH['SYSADD_DATETIME'] = data.TRNCFEEDMATH.SYSADD_DATETIME;
        data.TRNCFEEDMATH['SYSCHNG_DATETIME'] = sysDate[0][''];
        data.TRNCFEEDMATH['tableName'] = Htable;

        let result = await this.config.insertData(data.TRNCFEEDMATH)
        queryArray.push(result)
      }
      if (data.TRNCFEEDMATPOST) {
        SR_NO = 0
        for (let item of data.TRNCFEEDMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = data.TRNCFEEDMATH.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNCFEEDMATH.SYSADD_DATETIME;
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = Ptable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }

      }
      if (data.TRNCFEEDMATPOST.SubGodownData != '') {
        // SR_NO = 0
        for (let item of data.TRNCFEEDMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = data.TRNCFEEDMATH.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNCFEEDMATH.SYSADD_DATETIME;
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = Ptable;
          item['GODOWN_CODE'] = data.TRNCFEEDMATPOST.SubGodownData;
          item['QTY'] = Math.abs(item.QTY);

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }

      }
      if (data.TRNCFEEDSTOREMATI) {
        SR_NO = 0
        for (let item of data.TRNCFEEDSTOREMATI) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = data.TRNCFEEDMATH.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNCFEEDMATH.SYSADD_DATETIME;
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = Itable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
      if (data.TRNACCTMATSTATUS) {
        for (let item of data.TRNACCTMATSTATUS) {

          item['TRAN_NO'] = data.TRNCFEEDMATH.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNCFEEDMATH.SYSADD_DATETIME;
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = 'TRNACCTMATSTATUS';

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }

    } else {
      let autoIncremented = await this.config.executeQuery(`exec Get_Next_Trans_No @COMPANY_ID='${data.TRNCFEEDMATH.COMPANY_ID}',@voutype='${data.TRNCFEEDMATH.VOUCHER_TYPE}',@vouSubType=${data.TRNCFEEDMATH.TRAN_SUBTYPE},@vouseries='${data.TRNCFEEDMATH.VOUCHER_SERIES}',@effdate='${data.TRNCFEEDMATH.TRAN_DATE}',@TABLE_NAME=${Htable}  `);

      let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
      if (data.TRNCFEEDMATH) {
        data.TRNCFEEDMATH['TRAN_NO'] = autoIncremented[0][''];
        data.TRNCFEEDMATH['SYSADD_DATETIME'] = sysDate[0][''];
        data.TRNCFEEDMATH['SYSCHNG_DATETIME'] = sysDate[0][''];
        data.TRNCFEEDMATH['tableName'] = Htable;

        let result = await this.config.insertData(data.TRNCFEEDMATH)
        queryArray.push(result)
      }
      if (data.TRNCFEEDMATPOST) {
        SR_NO = 0
        for (let item of data.TRNCFEEDMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = autoIncremented[0][''];
          // item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = Ptable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
      if (data.TRNCFEEDMATH.SubGodownData != '') {
        // SR_NO = 0
        for (let item of data.TRNCFEEDMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = autoIncremented[0][''];
          // item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = Ptable;
          item['GODOWN_CODE'] = data.TRNCFEEDMATH.SubGodownData;
          item['QTY'] = Math.abs(item.QTY);

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }

      }
      if (data.TRNCFEEDSTOREMATI) {
        SR_NO = 0
        for (let item of data.TRNCFEEDSTOREMATI) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = Itable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }

      if (data.TRNACCTMATSTATUS) {
        SR_NO = 0
        for (let item of data.TRNACCTMATSTATUS) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['TRAN_SUBTYPE'] = data.TRNCFEEDMATH.TRAN_SUBTYPE
          item['tableName'] = Stable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
    }
    return await this.config.executeInsertQuery(queryArray);
  }

  async insDirectIssue(data) {
    let Htable
    let Ptable
    let Itable
    let queryArray = new Array();

    switch (data.TRNCFEEDMATH.COMPANY_ID) {
      case "104":
        Htable = 'TRNCFEEDMATH'
        Ptable = 'TRNCFEEDMATPOST'
        Itable = 'TRNCFEEDSTOREMATI'
        break;
      case "106":
        Htable = 'TRNCMEDMATH'
        Ptable = 'TRNCMEDMATPOST'
        Itable = 'TRNCMEDSTOREMATI'
        break;
      case "103":
        Htable = 'TRNDSTORMATH'
        Ptable = 'TRNDSTORMATPOST'
        Itable = 'TRNDSTORSTOREMATI'
        break;
      case "105":
        Htable = 'TRNPUMPMATH'
        Ptable = 'TRNPUMPMATPOST'
        Itable = 'TRNPUMPSTOREMATI'
        break;
      case "101":
        Htable = 'TRNACCTMATH'
        Ptable = 'TRNBIPRODMATPOST'
        Itable = 'TRNSTOREMATI'
        break;
    }
    let SR_NO = 0
    if (data.TRNCFEEDMATH.TRAN_NO != undefined) {
      await this.config.executeQuery(`delete from ${Htable} where TRAN_NO= ${data.TRNCFEEDMATH.TRAN_NO} `)
      await this.config.executeQuery(`delete from ${Ptable} where TRAN_NO= ${data.TRNCFEEDMATH.TRAN_NO} `)
      // await this.config.executeQuery(`delete from TRNSTORMATIREQU where TRAN_NO= ${data.TRNCFEEDMATH.TRAN_NO} `)
      await this.config.executeQuery(`delete from ${Itable} where TRAN_NO= ${data.TRNCFEEDMATH.TRAN_NO} `)
      let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);


      if (data.TRNCFEEDMATH) {
        data.TRNCFEEDMATH['TRAN_NO'] = data.TRNCFEEDMATH.TRAN_NO
        data.TRNCFEEDMATH['SYSADD_DATETIME'] = data.TRNCFEEDMATH.SYSADD_DATETIME;
        // data.TRNCFEEDMATH['REF_TRANNO'] = data.TRNCFEEDMATH.TRAN_NO
        data.TRNCFEEDMATH['SYSADD_DATETIME'] = sysDate[0][''];
        data.TRNCFEEDMATH['SYSCHNG_DATETIME'] = sysDate[0][''];
        data.TRNCFEEDMATH['tableName'] = Htable;
        let result = await this.config.insertData(data.TRNCFEEDMATH)
        queryArray.push(result)
      }

      if (data.TRNCFEEDMATPOST) {
        SR_NO = 0
        for (let item of data.TRNCFEEDMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO
          item['TRAN_NO'] = data.TRNCFEEDMATH.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNCFEEDMATH.SYSADD_DATETIME;
          item['REF_TRANNO'] = data.TRNCFEEDMATH.TRAN_NO
          item['SYSADD_DATETIME'] = sysDate[0][''],
            item['SYSCHNG_DATETIME'] = sysDate[0][''],
            item['tableName'] = 'TRNCFEEDMATPOST'

          let result = await this.config.insertData(item)
          queryArray.push(result)

        }
      }
      // if (data.TRNSTORMATIREQU) {
      //     for (let item of data.TRNCFEEDMATPOST) {
      //         SR_NO++
      //         item['SR_NO'] = SR_NO;
      //         item['TRAN_NO'] = data.TRNCFEEDMATH.TRAN_NO
      //         item['SYSADD_DATETIME'] = data.TRNCFEEDMATH.SYSADD_DATETIME;
      //         // item['REF_TRANNO'] = data.TRNCFEEDMATH.TRAN_NO
      //         item['SYSADD_DATETIME'] = sysDate[0][''];
      //         item['SYSCHNG_DATETIME'] = sysDate[0][''];
      //         item['tableName'] = 'TRNSTORMATIREQU';

      //         await this.config.insertData(item)
      //     }
      // }

      if (data.TRNCFEEDSTOREMATI) {
        SR_NO = 0
        for (let item of data.TRNCFEEDSTOREMATI) {
          SR_NO++
          item['SR_NO'] = SR_NO
          item['TRAN_NO'] = data.TRNCFEEDMATH.TRAN_NO
          item['SYSADD_DATETIME'] = data.TRNCFEEDMATH.SYSADD_DATETIME;
          item['REF_TRANNO'] = data.TRNCFEEDMATH.TRAN_NO
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = 'TRNCFEEDSTOREMATI';
          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }

    } else {
      let autoIncremented = await this.config.executeQuery(`exec Get_Next_Trans_No @COMPANY_ID='${data.TRNCFEEDMATH.COMPANY_ID}',@voutype='${data.TRNCFEEDMATH.TRAN_TYPE}',@vouSubType=${data.TRNCFEEDMATH.TRAN_SUBTYPE},@vouseries='${data.TRNCFEEDMATH.TRAN_SERIES}',@effdate='${data.TRNCFEEDMATH.TRAN_DATE}',@TABLE_NAME=${Htable}  `);

      let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
      if (data.TRNCFEEDMATH) {
        data.TRNCFEEDMATH['TRAN_NO'] = autoIncremented[0][''];
        // data.TRNCFEEDMATH['REF_TRANNO'] = autoIncremented[0][''];
        data.TRNCFEEDMATH['SYSADD_DATETIME'] = sysDate[0][''];
        data.TRNCFEEDMATH['SYSCHNG_DATETIME'] = sysDate[0][''];
        data.TRNCFEEDMATH['tableName'] = Htable;
        let result = await this.config.insertData(data.TRNCFEEDMATH)
        queryArray.push(result)
      }
      if (data.TRNCFEEDMATPOST) {
        SR_NO = 0
        for (let item of data.TRNCFEEDMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO
          item['TRAN_NO'] = autoIncremented[0][''],
            item['REF_TRANNO'] = autoIncremented[0][''],
            item['SYSADD_DATETIME'] = sysDate[0][''],
            item['SYSCHNG_DATETIME'] = sysDate[0][''],
            item['tableName'] = Ptable

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
      // if (data.TRNSTORMATIREQU) {
      //     for (let item of data.TRNSTORMATIREQU) {
      //         SR_NO++
      //         item['SR_NO'] = SR_NO;
      //         item['TRAN_NO'] = autoIncremented[0][''];
      //         // item['REF_TRANNO'] = autoIncremented[0][''];
      //         item['SYSADD_DATETIME'] = sysDate[0][''];
      //         item['SYSCHNG_DATETIME'] = sysDate[0][''];
      //         item['tableName'] = 'TRNSTORMATIREQU';

      //         await this.config.insertData(item)
      //     }
      // }

      if (data.TRNCFEEDSTOREMATI) {
        SR_NO = 0
        for (let item of data.TRNCFEEDSTOREMATI) {
          SR_NO++
          item['SR_NO'] = SR_NO
          item['TRAN_NO'] = autoIncremented[0][''];
          item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = Itable;
          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
    }
    return await this.config.executeInsertQuery(queryArray);
  }

  async insBGRNDirect(data) {
    let Htable
    let Ptable
    let Itable
    let Stable
    let GRNtable
    let MSTMATVALRATETable
    let TRNBIPRODMATPOSTtable
    let queryArray = new Array();


    switch (data.TRNACCTMATH.COMPANY_ID) {
      case '104':
        Htable = 'TRNCFEEDMATH '
        GRNtable = 'TRNPRCHIGRN '
        Stable = 'TRNACCTMATSTATUS'
        TRNBIPRODMATPOSTtable = 'TRNCFEEDMATPOST'
        Ptable = 'TRNMATPOST'
        MSTMATVALRATETable = 'MSTMATVALRATE'


        break;
      case '105':
        Htable = 'TRNPUMPMATH '
        GRNtable = 'TRNPRCHIGRN '
        Stable = 'TRNACCTMATSTATUS'
        TRNBIPRODMATPOSTtable = 'TRNPUMPMATPOST'
        Ptable = 'TRNMATPOST'
        MSTMATVALRATETable = 'MSTMATVALRATE'

        break;

      case '106':
        Htable = 'TRNCMEDMATH'
        GRNtable = 'TRNPRCHIGRN '
        Stable = 'TRNACCTMATSTATUS'
        TRNBIPRODMATPOSTtable = 'TRNCMEDMATPOST'
        Ptable = 'TRNMATPOST'
        MSTMATVALRATETable = 'MSTMATVALRATE'

        break;


      case '101':
        Htable = 'TRNACCTMATH'
        GRNtable = 'TRNPRCHIGRN '
        Stable = 'TRNACCTMATSTATUS'
        TRNBIPRODMATPOSTtable = 'TRNBIPRODMATPOST'
        Ptable = 'TRNMATPOST'
        MSTMATVALRATETable = 'MSTMATVALRATE'
        break;
      case '103':
        Htable = 'TRNDSTORMATH'
        GRNtable = 'TRNPRCHIGRN '
        Stable = 'TRNACCTMATSTATUS'
        TRNBIPRODMATPOSTtable = 'TRNDSTORMATPOST'
        Ptable = 'TRNMATPOST'
        MSTMATVALRATETable = 'MSTMATVALRATE'
        break;
      case '107':
        Htable = 'TRNBIPRODMATH'
        GRNtable = 'TRNPRCHIGRN '
        TRNBIPRODMATPOSTtable = 'TRNBIPRODMATPOST'
        Ptable = 'TRNMATPOST'
        Stable = 'TRNACCTMATSTATUS'
        MSTMATVALRATETable = 'MSTMATVALRATE'
        break;
    }

    let SR_NO = 0
    if (data.TRNACCTMATH.TRAN_NO != undefined) {
      await this.config.executeQuery(`delete from ${Htable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      await this.config.executeQuery(`delete from ${GRNtable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      await this.config.executeQuery(`delete from ${Stable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      await this.config.executeQuery(`delete from ${TRNBIPRODMATPOSTtable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      await this.config.executeQuery(`delete from ${Ptable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      await this.config.executeQuery(`delete from ${MSTMATVALRATETable} where TRAN_NO= ${data.TRNACCTMATH.TRAN_NO} `)
      let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);


      if (data.TRNACCTMATH) {
        data.TRNACCTMATH['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO;
        // data.TRNACCTMATH['REF_TRANNO'] = autoIncremented[0][''];
        data.TRNACCTMATH['SYSADD_DATETIME'] = sysDate[0][''];
        data.TRNACCTMATH['SYSCHNG_DATETIME'] = sysDate[0][''];

        data.TRNACCTMATH['tableName'] = Htable;
        let result = await this.config.insertData(data.TRNACCTMATH)
        queryArray.push(result)

      }

      if (data.TRNPRCHIGRN) {
        SR_NO = 0
        for (let item of data.TRNPRCHIGRN) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;
          item['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO;
          item['REF_TRANNO'] = data.TRNACCTMATH.TRAN_NO;
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          // if (data.TRNACCTMATH.COMPANY_ID == 103 || data.TRNACCTMATH.COMPANY_ID == 106 || data.TRNACCTMATH.COMPANY_ID == 101) {
          //   item['GODOWN_CODE'] = 0;
          // }
          item['tableName'] = GRNtable;

          let result = await this.config.insertData(item)
          queryArray.push(result)

          let MSTMATVALRATEObj = {}
          MSTMATVALRATEObj['SR_NO'] = SR_NO;
          MSTMATVALRATEObj['SYSADD_DATETIME'] = sysDate[0][''];
          MSTMATVALRATEObj['SYSCHNG_DATETIME'] = sysDate[0][''];
          MSTMATVALRATEObj['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO;
          MSTMATVALRATEObj['MAT_CODE'] = item.MAT_CODE;
          MSTMATVALRATEObj['REF_TRANNO'] = item.REF_TRANNO;
          MSTMATVALRATEObj['RATE'] = item.RATE;
          MSTMATVALRATEObj['STATUS_CODE'] = item.STATUS_CODE;
          MSTMATVALRATEObj['tableName'] = MSTMATVALRATETable;
          MSTMATVALRATEObj['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;


          let result1 = await this.config.insertData(MSTMATVALRATEObj)
          queryArray.push(result1)

        }
      }
      if (data.TRNACCTMATSTATUS) {
        SR_NO = 0
        for (let item of data.TRNACCTMATSTATUS) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;
          item['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO;
          item['REF_TRANNO'] = data.TRNACCTMATH.TRAN_NO;
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          if (data.TRNACCTMATH.COMPANY_ID == 103 || data.TRNACCTMATH.COMPANY_ID == 106 || data.TRNACCTMATH.COMPANY_ID == 101) {
            item['GODOWN_CODE'] = 0;
          }
          item['tableName'] = Stable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
      if (data.TRNBIPRODMATPOST) {
        SR_NO = 0
        for (let item of data.TRNBIPRODMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;
          item['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO;
          item['REF_TRANNO'] = data.TRNACCTMATH.TRAN_NO;
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          if (data.TRNACCTMATH.COMPANY_ID == 103 || data.TRNACCTMATH.COMPANY_ID == 106 || data.TRNACCTMATH.COMPANY_ID == 101) {
            item['GODOWN_CODE'] = 0;
          }
          item['tableName'] = TRNBIPRODMATPOSTtable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
      if (data.TRNMATPOST) {
        SR_NO = 0
        for (let item of data.TRNMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;
          item['TRAN_NO'] = data.TRNACCTMATH.TRAN_NO;
          item['REF_TRANNO'] = data.TRNACCTMATH.TRAN_NO
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          // if (data.TRNACCTMATH.COMPANY_ID == 103 || data.TRNACCTMATH.COMPANY_ID == 106 || data.TRNACCTMATH.COMPANY_ID == 101) {
          //   item['GODOWN_CODE'] = 0;
          // }
          item['tableName'] = Ptable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }

    } else {
      let autoIncremented = await this.config.executeQuery(`exec Get_Next_Trans_No @COMPANY_ID='${data.TRNACCTMATH.COMPANY_ID}',@voutype='${data.TRNACCTMATH.TRAN_TYPE}',@vouSubType=${data.TRNACCTMATH.TRAN_SUBTYPE},@vouseries='${data.TRNACCTMATH.TRAN_SERIES}',@effdate='${data.TRNACCTMATH.TRAN_DATE}',@TABLE_NAME=${Htable} `);

      let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
      if (data.TRNACCTMATH) {
        data.TRNACCTMATH['TRAN_NO'] = autoIncremented[0][''];
        // data.TRNACCTMATH['REF_TRANNO'] = autoIncremented[0][''];
        data.TRNACCTMATH['SYSADD_DATETIME'] = sysDate[0][''];
        data.TRNACCTMATH['SYSCHNG_DATETIME'] = sysDate[0][''];

        data.TRNACCTMATH['tableName'] = Htable;
        let result = await this.config.insertData(data.TRNACCTMATH)
        queryArray.push(result)
      }

      if (data.TRNPRCHIGRN) {
        SR_NO = 0
        for (let item of data.TRNPRCHIGRN) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          // if (data.TRNACCTMATH.COMPANY_ID == 103 || data.TRNACCTMATH.COMPANY_ID == 106 || data.TRNACCTMATH.COMPANY_ID == 101) {
          //   item['GODOWN_CODE'] = 0;
          // }
          item['tableName'] = GRNtable;

          let result = await this.config.insertData(item)
          queryArray.push(result)

          let MSTMATVALRATEObj = {}
          MSTMATVALRATEObj['SR_NO'] = SR_NO;
          MSTMATVALRATEObj['SYSADD_DATETIME'] = sysDate[0][''];
          MSTMATVALRATEObj['SYSCHNG_DATETIME'] = sysDate[0][''];
          MSTMATVALRATEObj['TRAN_NO'] = autoIncremented[0][''];
          MSTMATVALRATEObj['MAT_CODE'] = item.MAT_CODE;
          MSTMATVALRATEObj['REF_TRANNO'] = item.REF_TRANNO;
          MSTMATVALRATEObj['RATE'] = item.RATE;
          MSTMATVALRATEObj['STATUS_CODE'] = item.STATUS_CODE;
          MSTMATVALRATEObj['tableName'] = MSTMATVALRATETable;
          MSTMATVALRATEObj['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;


          let result1 = await this.config.insertData(MSTMATVALRATEObj)
          queryArray.push(result1)
        }
      }
      if (data.TRNACCTMATSTATUS) {
        SR_NO = 0
        for (let item of data.TRNACCTMATSTATUS) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          item['tableName'] = Stable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
      if (data.TRNBIPRODMATPOST) {
        SR_NO = 0
        for (let item of data.TRNBIPRODMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          if (data.TRNACCTMATH.COMPANY_ID == 103 || data.TRNACCTMATH.COMPANY_ID == 106 || data.TRNACCTMATH.COMPANY_ID == 101) {
            item['GODOWN_CODE'] = 0;
          }
          item['tableName'] = TRNBIPRODMATPOSTtable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
      if (data.TRNMATPOST) {
        SR_NO = 0
        for (let item of data.TRNMATPOST) {
          SR_NO++
          item['SR_NO'] = SR_NO;
          item['TRAN_DATE'] = data.TRNACCTMATH.TRAN_DATE;
          item['TRAN_NO'] = autoIncremented[0][''];
          item['REF_TRANNO'] = autoIncremented[0][''];
          item['SYSADD_DATETIME'] = sysDate[0][''];
          item['SYSCHNG_DATETIME'] = sysDate[0][''];
          // if (data.TRNACCTMATH.COMPANY_ID == 103 || data.TRNACCTMATH.COMPANY_ID == 106 || data.TRNACCTMATH.COMPANY_ID == 101) {
          //   item['GODOWN_CODE'] = 0;
          // }
          item['tableName'] = Ptable;

          let result = await this.config.insertData(item)
          queryArray.push(result)
        }
      }
    }
    return await this.config.executeInsertQuery(queryArray);
  }
}
