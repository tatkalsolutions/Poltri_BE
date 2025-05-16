/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { SQL } from './database/sql.sql';
@Injectable()
export class AppService {

  constructor(
    private sql: SQL,

  ) { }
  async companyDetails() {
    let result = await this.sql.executeQuery(`select * from CNFCOMPANY`);
    return result[0];
  }
}

