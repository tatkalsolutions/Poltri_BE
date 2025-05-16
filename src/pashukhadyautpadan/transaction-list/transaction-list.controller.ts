import { Body, Controller, Post } from '@nestjs/common';
import { TransactionListService } from './transaction-list.service';

@Controller('pashkhadyautpadan-list')
export class TransactionListController {
  constructor(private readonly transactionListService: TransactionListService) { }
  // @Post('insAndUpdConsumption')
  // async insAndUpdConsumption(@Body() data) {
  //   return await this.transactionListService.insAndUpdConsumption(data);
  // }

  @Post('insAndStoreConsumption')
  async insAndStoreConsumption(@Body() data) {
    return await this.transactionListService.insAndStoreConsumption(data);
  }
  @Post('insGhatTut')
  async insGhatTut(@Body() data) {
    return await this.transactionListService.insGhatTut(data);
  }
}
