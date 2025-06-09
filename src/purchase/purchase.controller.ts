import { Body, Controller, Get, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
export class PurchaseController {

  constructor(private readonly purchaseService: PurchaseService) { }

  @Get('/getGLAccoutList')
  async getGLAccountList() {
    return this.purchaseService.getGLAccountList();
  }


  @Post('/InsertServicePurchase')
  async ServicePurchaseInsert(@Body() data) {
    return this.purchaseService.servicepurchaseInsert(data.matrixData)
  }
  @Get('/getHSNSAC')
  async getHSNSACList() {
    return this.purchaseService.getHSNSACList()
  }

  @Post('/dsExistingPurchaseData')
  async dsExistingPurchaseData(@Body() data) {
    return this.purchaseService.dsExistingPurchaseData(data);
  }

}
