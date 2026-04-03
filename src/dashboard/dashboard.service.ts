import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class DashboardService {
    constructor(
        private readonly sqlService: SQL,
    ) { }
    async getTodayTotalBird() {
        let ds: any = await this.sqlService.executeQuery(`SELECT ISNULL(SUM(QTY),0) AS STOCK FROM TRNMATPOST WHERE MAT_CODE IN (SELECT CODE FROM MSTMATERIALS WHERE MATERIAL_TYPE = 103 AND STATUS_CODE = 0 ) AND STATUS_CODE = 0`);
        return { totalStock: ds[0].STOCK };
    }
    async getTodayTotalFeedStock() {
        let ds: any = await this.sqlService.executeQuery(`SELECT ISNULL(SUM(QTY),0) AS STOCK FROM TRNMATPOST WHERE MAT_CODE IN (SELECT CODE FROM MSTMATERIALS WHERE MATERIAL_TYPE = 108 AND STATUS_CODE = 0 ) AND STATUS_CODE = 0`);
        return { totalStock: ds[0].STOCK };
    }
    async getTotalEggs() {
        let ds: any = await this.sqlService.executeQuery(`SELECT ISNULL(SUM(QTY),0) AS STOCK FROM TRNMATPOST WHERE MAT_CODE IN (SELECT CODE FROM MSTMATERIALS WHERE MATERIAL_TYPE = 104 AND STATUS_CODE = 0 ) AND STATUS_CODE = 0`);
        return { totalStock: ds[0].STOCK };
    }

    async getTotalTodaysSale() {
        let dsTotal: any = await this.sqlService.executeQuery(`SELECT ISNULL(SUM(TRAN_AMT),0) AS  TRAN_AMT FROM TRNACCTMATH WHERE STATUS_CODE = 0 AND SUBSTRING (CAST (TRAN_NO AS VARCHAR(20)),8,3 ) = 115 AND TRAN_DATE = 20250401`)
        let dsCreditTotal: any = await this.sqlService.executeQuery(`SELECT ISNULL(SUM(TRAN_AMT),0) AS  TRAN_AMT FROM TRNACCTMATH WHERE STATUS_CODE = 0 AND SUBSTRING (CAST (TRAN_NO AS VARCHAR(20)),8,3 ) = 115 AND TRAN_SUBTYPE = 43 AND TRAN_DATE = 20250401 -- UDHAR`)
        let dsCashTotal: any = await this.sqlService.executeQuery(`SELECT ISNULL(SUM(TRAN_AMT),0) AS  TRAN_AMT FROM TRNACCTMATH WHERE STATUS_CODE = 0 AND SUBSTRING (CAST (TRAN_NO AS VARCHAR(20)),8,3 ) = 115 AND TRAN_SUBTYPE = 4 AND TRAN_DATE = 20250401 --- ROKH`)

        return {
            totalSale: dsTotal[0].TRAN_AMT,
            creditTotal: dsCreditTotal[0].TRAN_AMT,
            cashTotal: dsCashTotal[0].TRAN_AMT
        }
    }

    async getEggProductionAnalytics() {

        let result: any[] = [];

        for (let i = 11; i >= 0; i--) {

            let m = moment().subtract(i, 'months');

            let startDate = parseInt(m.startOf('month').format('YYYYMMDD'));
            let endDate = parseInt(m.endOf('month').format('YYYYMMDD'));
            let monthName = m.format('MMM'); // Jan, Feb...

            // ----------- Normal Eggs
            let normal: any = await this.sqlService.executeQuery(`
            SELECT ISNULL(SUM(QTY),0) AS QTY 
            FROM TRNMATPOST 
            WHERE STATUS_CODE = 0 
              AND MAT_CODE IN (1010300001,1010300036) 
              AND SUBSTRING(CAST(TRAN_NO AS VARCHAR(20)),8,3) = '931'
              AND TRAN_DATE BETWEEN ${startDate} AND ${endDate}
        `);

            // ----------- Broken Eggs
            let broken: any = await this.sqlService.executeQuery(`
            SELECT ISNULL(SUM(QTY),0) AS QTY 
            FROM TRNMATPOST 
            WHERE STATUS_CODE = 0 
              AND MAT_CODE IN (1010300009,1010300010) 
              AND SUBSTRING(CAST(TRAN_NO AS VARCHAR(20)),8,3) IN ('931','933')
              AND TRAN_DATE BETWEEN ${startDate} AND ${endDate}
        `);

            // ----------- Waste Eggs
            let waste: any = await this.sqlService.executeQuery(`
            SELECT ABS(ISNULL(SUM(QTY),0)) AS QTY 
            FROM TRNMATPOST 
            WHERE STATUS_CODE = 0 
              AND MAT_CODE IN (1010300009,1010300010) 
              AND SUBSTRING(CAST(TRAN_NO AS VARCHAR(20)),8,3) = '930'
              AND TRAN_DATE BETWEEN ${startDate} AND ${endDate}
        `);

            result.push({
                month: monthName,
                normal: normal[0].QTY,
                broken: broken[0].QTY,
                waste: waste[0].QTY
            });
        }

        return result;
    }
}
