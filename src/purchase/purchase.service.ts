import { Injectable } from '@nestjs/common';
import { ServicePurchaseTrans } from 'src/BOTrans/BOServicePurchaseTrans';

@Injectable()
export class PurchaseService {
  constructor(private servicePurchase: ServicePurchaseTrans) { }
  async servicepurchaseInsert(data) {
    return await this.servicePurchase.PurchaseInsertGST(data.TRNACCTMATH, data.TRNACCTPOST, data.TRNACCTMATIPRCH, data.TRNACCTMATIOUTSTAND, data.TRNACCTMATITAX, data?.TRNACCTMATIPRCHGRN, data?.MSTMATVALRATE)
  }
}
