import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { SQL } from 'src/database/sql.sql';
@Injectable()
export class BOTRNACCTMATH {
    constructor(private config: SQL) { }
    async insertTranAcctMatH(data) {
        // insert Case
        data['tableName'] = 'TRNACCTMATH'

        if (data.TRAN_NO) {

            // GENERATE SYSTEM DATETIME
            data['TRAN_NO'] = data.TRAN_NO
            let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
            data['SYSCHNG_DATETIME'] = sysDate[0]['']

        } else {
            // GENERATE TRAN_NO
            // let getTarnObj = {
            //     "COMPANY_ID": data.COMPANY_ID,
            //     "voutype": data.TRAN_TYPE,
            //     "vouSubType": data.TRAN_SUBTYPE,
            //     "vouseries": data.TRAN_SERIES,
            //     "effdate": data.TRAN_DATE,
            //     "TABLE_NAME": data.tableName
            // }

            // let TRANNO = await this.config.Get_Next_Trans_No(getTarnObj);

            let object = {
                name: 'Get_Next_Trans_No',
                params: [
                    data.COMPANY_ID,
                    data.TRAN_TYPE,
                    data.TRAN_SUBTYPE,
                    data.TRAN_SERIES,
                    data.TRAN_DATE,
                    'TRNACCTMATH',
                ],
            };
            let TRANNO = await this.config.execSpWithParams(object);
            data['TRAN_NO'] = TRANNO[0]['']

            // GENERATE TRANFORMAT NO
            let TRANFORMAT = await this.config.executeQuery(`select dbo.FormatDocNo(${data.TRAN_NO})`);
            data['TRANFORMAT_NO'] = TRANFORMAT[0]['']

            // GENERATE SYSTEM DATETIME
            let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
            data['SYSADD_DATETIME'] = sysDate[0]['']
            data['SYSCHNG_DATETIME'] = sysDate[0]['']
            data['SYSCHNG_LOGIN'] = data.SYSADD_LOGIN

        }

        // // ---- Bank Ledger Account for Bank Details on Invoice ---------------------------
        // if (data.BANKSUB_GLACNO == null || data.BANKSUB_GLACNO == 0) {
        //     if ((data.TRAN_TYPE == 115 && data.TRAN_SUB_TYPE != 22) || data.TRAN_TYPE == 801) {
        //         let banksubglacno = await this.config.executeQuery(`SELECT CNFTRANTYPES.BANKSUB_GLACNO FROM CNFTRANTYPES WHERE CNFTRANTYPES.TRAN_TYPE=${data.TRAN_TYPE} AND CNFTRANTYPES.TRAN_SUBTYPE=${data.TRAN_SUBTYPE}`);
        //         if (banksubglacno) {
        //             data.BANKSUB_GLACNO = 0
        //         } else {
        //             data.BANKSUB_GLACNO = banksubglacno[0]['BANKSUB_GLACNO']
        //         }
        //     }
        // }

        // // --	Daily Entry Serial Number

        // if (data.SR_NO === 0 || data.SR_NO == null) {

        //     let intSrNo = await this.config.executeQuery(`select (ISNULL(MAX(SR_NO),0)+1) FROM TRNACCTMATH WHERE TRAN_DATE=${data.TRAN_DATE}`);
        //     data['SR_NO'] = intSrNo[0]['']
        //     //// as per discussion with jayraj sir this case manage in edit case 
        //     // IF object_id('Tempdb..##TRNACCTMATH') is not null --- Required to get original serial number in approval
        //     // BEGIN
        //     // 	IF (SELECT COUNT(*) FROM ##TRNACCTMATH WHERE TRAN_NO=@bintTranNo) > 0
        //     // 	BEGIN
        //     // 		SET @intSrNo = (SELECT SR_NO FROM ##TRNACCTMATH WHERE TRAN_NO=@bintTranNo)
        //     // 	END
        //     // END
        // }

        // if (data.EWAYBILL_NO == null || data.EWAYBILL_NO === 0) {
        //     let EWayBillNo = await this.config.executeQuery(`SELECT EWAYBILL_NO FROM TRNACCTEWAYBILL WHERE TRAN_NO=${data.TRAN_NO}`);
        //     if (EWayBillNo.length == 0) {
        //         data.EWAYBILL_NO = 0
        //     } else {
        //         data.EWAYBILL_NO = EWayBillNo[0]['EWAYBILL_NO']
        //     }
        // }
        // Insert Data in Table
        await this.config.insertData(data);


        return data;
    }
}