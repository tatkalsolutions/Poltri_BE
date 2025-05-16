import { Body, Controller, Post } from '@nestjs/common';
import { PashukhadyautpadanCommonService } from './pashukhadyautpadan-common.service'
@Controller('pashukhadyautpadan-common')
export class PashukhadyautpadanCommonController {

  constructor(private readonly PashukhadyautpadanCommonService: PashukhadyautpadanCommonService) { }

  @Post()
  async transaction_list(@Body() data) {
    return await this.PashukhadyautpadanCommonService.transactionList(data);
  }
  @Post('ProdType')
  async Get_ProdType(@Body() data) {
    return await this.PashukhadyautpadanCommonService.Get_ProdType(data);
  }
  @Post('Sel_ExistingTransactionsCFeedProd')
  async Sel_ExistingTransactionsCFeedProd(@Body() data) {
    return await this.PashukhadyautpadanCommonService.Sel_ExistingTransactionsCFeedProd(data);
  }
}
