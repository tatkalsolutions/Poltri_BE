import { Injectable } from '@nestjs/common';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class PashukhayavibhagcommonService {

  constructor(
    private config: SQL
  ) { }

  async Sel_PendingRequ(data) {
    let object = {
      name: 'Sel_PendingRequ',
      params: [data.CompanyID, data.TranType]
    }
    console.log(object)
    return await this.config.execSpWithParams(object);
  }

  async Sel_ExistingTransactionsFinance(data) {
    let object = {
      name: 'Sel_ExistingTransactionsFinance',
      params: [data.TranNo, data.TranSubType, data.AmendNo]
    }
    console.log(object)
    return await this.config.execSpWithParams(object, 1);
  }
}
