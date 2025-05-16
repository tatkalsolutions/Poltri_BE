import { Injectable } from '@nestjs/common';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class PashukhadyautpadanCommonService {
  constructor(private config: SQL) { }

  async transactionList(data) {
    let object = {
      name: 'Sel_TransactionsCFeedProd',
      params: [data.CompUnit, data.MenuDocNo, data.UserID, data.StartDate, data.EndDate]
    }

    return await this.config.execSpWithParams(object, 1);
  }

  async Get_ProdType(data) {
    let object = {
      name: 'Get_ProdType',
      params: [data.ProdType]
    }

    return await this.config.execSpWithParams(object);
  }
  async Sel_ExistingTransactionsCFeedProd(data) {
    let object = {
      name: 'Sel_ExistingTransactionsCFeedProdOld',
      params: [data.TranNo, data.TranSubType]
    }

    return await this.config.execSpWithParams(object, 1);
  }
}
