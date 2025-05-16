import { Body, Controller, Post } from '@nestjs/common';
import { TransactionListService } from './transaction-list.service';

@Controller('pashukhadyatransaction-list')
export class TransactionListController {
  constructor(private readonly transactionListService: TransactionListService) { }

  @Post('/insRequisitionSlip')
  async insRequisitionSlip(@Body() data) {
    return await this.transactionListService.insRequisitionSlip(data);
  }
  /**स्टोर-पशुखाद्य  Issue Ag slip(INDENT) && Issue against Transfer Req */
  @Post('/insIssueAgslip')
  async insIssueAgslip(@Body() data) {
    return await this.transactionListService.insIssueAgslip(data);
  }
  @Post('/insDirectIssue')
  async insDirectIssue(@Body() data) {
    return await this.transactionListService.insDirectIssue(data);
  }
  @Post('/insBGRNDirect')
  async insBGRNDirect(@Body() data) {
    return await this.transactionListService.insBGRNDirect(data);
  }
}
