import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { SQL } from 'src/database/sql.sql';
@Injectable()
export class BOTRNACCTMATIOUTSTAND {
    constructor(private config: SQL) { }
    async insertTranAcctMatioutstand(data) {

        if (data.REF_TRANNO1 == null || data.REF_TRANNO1 == undefined) {
            data['REF_TRANNO1'] = data.TRAN_NO
        }


        // --Is Project base sales purchase control ? - Olive
        let ProjAppl = await this.config.executeQuery(`SELECT IS_APPLICABLE FROM CNFCONSTTRANS WHERE CODE=140`);
        if (ProjAppl[0]['IS_APPLICABLE'] == 1) {
            if (data['REF_TRANNO2'] == null || data['REF_TRANNO2'] == undefined) {
                if (data.TRAN_NO == data.REF_TRANNO) {
                    let reftranno2 = await this.config.executeQuery(`SELECT REF_TRANNO2 FROM TRNACCTMATH WHERE TRAN_NO=${data.TRAN_NO}`);
                    data['REF_TRANNO2'] = reftranno2[0]['REF_TRANNO2']
                }

                if (data.TRAN_NO != data.REF_TRANNO) {
                    let reftranno2 = await this.config.executeQuery(`SELECT REF_TRANNO2 FROM TRNACCTMATH WHERE TRAN_NO=${data.REF_TRANNO}`);
                    data['REF_TRANNO2'] = reftranno2[0]['REF_TRANNO2']
                }
            }
        }

        // Insert Data in Table
        return await this.config.insertData(data);


        // return data;
    }
}