import { Module } from '@nestjs/common';
import { TransactionListService } from './transaction-list.service';
import { TransactionListController } from './transaction-list.controller';
import { SQL } from 'src/database/sql.sql';

@Module({
  controllers: [TransactionListController],
  providers: [TransactionListService, SQL],
})
export class TransactionListModule { }
