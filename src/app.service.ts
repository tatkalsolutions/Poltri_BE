/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { SQL } from './database/sql.sql';
import * as moment from 'moment';
@Injectable()
export class AppService {

  constructor(
    private sql: SQL,

  ) { }
  async companyDetails() {
    let result = await this.sql.executeQuery(`select * from CNFCOMPANY`);
    return result[0];
  }

  async setDailyEggRate(data: any) {
    /**
     * data = {
     *      RATE : 0,
     *      TRAN_DATE : 20250608
     * }
     */
    let dsExistingData: any = await this.sql.executeQuery(`SELECT TOP 1 CODE, TRAN_DATE, RATE, STATUS_CODE FROM MSTDAILYEGGRATE WHERE STATUS_CODE = 0 AND TRAN_DATE = ${data?.TRAN_DATE} ORDER BY TRAN_DATE DESC`);
    let query: string = ``;
    if (dsExistingData.length > 0) {
      ///---------------- update against TRAN_DATE
      query = `UPDATE MSTDAILYEGGRATE SET RATE = ${data?.RATE} WHERE CODE = '${dsExistingData?.[0]?.CODE}'`;
    } else {
      ///-------------------- Insert against TRAN_DATE
      query = `INSERT INTO MSTDAILYEGGRATE (TRAN_DATE, RATE, STATUS_CODE, SYSADD_DATETIME) VALUES('${data?.TRAN_DATE}', '${data?.RATE}', '${0}', '${moment().format("YYYYMMDDHH:mm:ss")}')`;
    }
    return await this.sql.executeInsertQuery([query]);
  }
}

