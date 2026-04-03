import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommonService } from './common/common.service';
import { AppService } from './app.service';
import { Public } from './auth/Public';
@Controller()
export class AppController {
  constructor(
    private commonService: CommonService,
    private appService: AppService
  ) { }

  @Public() @Get()
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


