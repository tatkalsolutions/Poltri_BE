import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor';
import { MsgSenderModule } from './msg-sender/msg-sender.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { SQL } from './database/sql.sql';
import { CloudModule } from './cloud/cloud.module';
import { AdminModule } from './admin/admin.module';
import { CommonService } from './common/common.service';
import { MukhyaVibhagModule } from './mukhya_vibhag/mukhya_vibhag.module';
import { DairyMainModule } from './dairy-main/dairy-main.module';
import { PumpModule } from './pump/pump.module';
import { PashukhadyavibhagModule } from './pashukhadyavibhag/pashukhadyavibhag.module';
import { PashukhayavibhagcommonModule } from './pashukhayavibhagcommon/pashukhayavibhagcommon.module';
import { PashukhadyautpadanModule } from './pashukhadyautpadan/pashukhadyautpadan.module';
import { SalesModule } from './sales/sales.module';
import { ReportModule } from './report/report.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    MsgSenderModule,
    HttpModule,
    ScheduleModule.forRoot(),
    CloudModule,
    AdminModule,
    MukhyaVibhagModule,
    DairyMainModule,
    PumpModule,
    PashukhadyavibhagModule,
    PashukhayavibhagcommonModule,
    PashukhadyautpadanModule,
    SalesModule,
    ReportModule,
    PurchaseModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SQL, { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor, },
    CommonService
  ],
})
export class AppModule { }

