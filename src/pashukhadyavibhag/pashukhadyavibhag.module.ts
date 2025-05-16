import { Module } from '@nestjs/common';
import { TransactionListModule } from './transaction-list/transaction-list.module';

@Module({
  imports: [TransactionListModule]
})
export class PashukhadyavibhagModule {}
