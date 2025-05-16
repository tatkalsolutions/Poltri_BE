import { Module } from '@nestjs/common';
import { PashukhadyautpadanCommonModule } from './pashukhadyautpadan-common/pashukhadyautpadan-common.module';
import { TransactionListModule } from './transaction-list/transaction-list.module';

@Module({
  imports: [PashukhadyautpadanCommonModule, TransactionListModule]
})
export class PashukhadyautpadanModule {}
