import { Module } from '@nestjs/common';
import { TransactionListService } from './transaction-list.service';
import { TransactionListController } from './transaction-list.controller';
import { SQL } from 'src/database/sql.sql';

@Module({
  providers: [TransactionListService, SQL],
  controllers: [TransactionListController]
})
export class TransactionListModule { }
