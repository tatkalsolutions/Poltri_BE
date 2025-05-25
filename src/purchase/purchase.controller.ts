import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
export class PurchaseController {

  constructor(private readonly purchaseService: PurchaseService) { }

  @Post('/InsertServicePurchase')
  async ServicePurchaseInsert(@Body() data) {
    return this.purchaseService.servicepurchaseInsert(data.matrixData)
  }
}
