import { Injectable } from '@nestjs/common';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class PumpCommonService {
  constructor(private config: SQL) { }

  async branch_List(data) {
    var result = await this.config.executeQuery(`select * from ${data.table} where ${data.condition}`);
    return result
  }

}
