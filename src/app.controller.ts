import { Body, Controller, Get, Post } from '@nestjs/common';
import { SQL } from './database/sql.sql';
import { CommonService } from './common/common.service';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private commonService: CommonService,
    private appService: AppService
  ) { }
  @Get()
  testGet() {
    return { message: "Backend Run Successfully., :) SHUBHAM SAWANT" }
  }
  @Post('/menuDetails')
  menuDetails(@Body() data) {
    return this.commonService.menuDetails(data);
  }
  @Get('/companyDetails')
  async companyDetails() {
    return this.appService.companyDetails();
  }

  @Post('setDailyEggRate')
  async setDailyEggRate(@Body() body: any) {
    return await this.appService.setDailyEggRate(body);
  }
}


