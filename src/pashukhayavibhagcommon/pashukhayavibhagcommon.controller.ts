import { Body, Controller, Post } from '@nestjs/common';
import { PashukhayavibhagcommonService } from './pashukhayavibhagcommon.service';

@Controller('pashukhayavibhag-common')
export class PashukhayavibhagcommonController {
  constructor(private readonly PashukhayavibhagcommonService: PashukhayavibhagcommonService) { }
  @Post('Sel_PendingRequ')
  async Sel_PendingRequ(@Body() data) {
    return await this.PashukhayavibhagcommonService.Sel_PendingRequ(data)
  }

  @Post('Sel_ExistingTransactionsFinance')
  async Sel_ExistingTransactionsFinance(@Body() data) {
    return await this.PashukhayavibhagcommonService.Sel_ExistingTransactionsFinance(data)
  }
}
