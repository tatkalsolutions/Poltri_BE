import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { ServicePurchaseTrans } from 'src/BOTrans/BOServicePurchaseTrans';
import { SQL } from 'src/database/sql.sql';
import { BOTRANACCTPOST } from 'src/BOTrans/BOTranacctpost';

@Module({
  providers: [PurchaseService, ServicePurchaseTrans, SQL, BOTRANACCTPOST],
  controllers: [PurchaseController]
})
export class PurchaseModule { }
