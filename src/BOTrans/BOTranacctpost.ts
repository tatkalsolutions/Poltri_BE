import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { SQL } from 'src/database/sql.sql';
@Injectable()
export class BOTRANACCTPOST {
    constructor(private config: SQL) { }
    async insertTranAcctPost(data) {
        var intCount = 0;
        //---- For year closeing entry status update
        if (data.SR_NO == 1 && data.TRAN_SUBTYPE == 99 && data.TRAN_NO.substring(8, 3) == '101') {
            let result = await this.config.executeQuery(`SELECT 
			COUNT(*)
	        FROM 
			TRNACCTMATH
	        WHERE 
			TRAN_DATE = '${data.TRAN_DATE}'
			AND SUBSTRING(CONVERT(VARCHAR,TRAN_NO),8,3) = SUBSTRING(CONVERT(VARCHAR,${data.TRAN_NO}),8,3)
			AND TRAN_SUBTYPE = ${data.TRAN_SUBTYPE}
			AND TRAN_NO < ${data.TRAN_NO}
			AND STATUS_CODE = 0`);
            console.log(result);

            intCount = result[0][''];

            if (intCount > 0) {
                await this.config.executeQuery(`UPDATE
                TRNACCTMATH
                SET
                STATUS_CODE = 1
                WHERE
                TRAN_DATE = '${data.TRAN_DATE}'
				AND SUBSTRING(CONVERT(VARCHAR, TRAN_NO), 8, 3) = SUBSTRING(CONVERT(VARCHAR, ${data.TRAN_NO}), 8, 3)
				AND TRAN_SUBTYPE = ${data.TRAN_SUBTYPE}
				AND TRAN_NO < ${data.TRAN_NO}
				AND STATUS_CODE = 0`)

                await this.config.executeQuery(`UPDATE
                TRNACCTPOST
                SET
                STATUS_CODE = 1
                WHERE
                TRAN_DATE = '${data.TRAN_DATE}'
				AND SUBSTRING(CONVERT(VARCHAR, TRAN_NO), 8, 3) = SUBSTRING(CONVERT(VARCHAR, ${data.TRAN_NO}), 8, 3)
				AND TRAN_SUBTYPE = ${data.TRAN_SUBTYPE}
				AND TRAN_NO < ${data.TRAN_NO}
				AND STATUS_CODE = 0`)
            }
        }

        return await this.config.insertData(data);
    }
}