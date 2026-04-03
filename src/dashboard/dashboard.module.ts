import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SQL } from 'src/database/sql.sql';

@Module({
  providers: [DashboardService, SQL],
  controllers: [DashboardController,]
})
export class DashboardModule { }
