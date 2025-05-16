import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SQL } from 'src/database/sql.sql';

@Module({
  controllers: [SalesController],
  providers: [SalesService, SQL]
})
export class SalesModule { }
