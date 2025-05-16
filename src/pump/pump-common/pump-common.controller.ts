import { Body, Controller, Post } from '@nestjs/common';
import { PumpCommonService } from './pump-common.service';

@Controller('PumpCommon')
export class PumpCommonController {
  constructor(private readonly PumpCommonService: PumpCommonService) { }
  @Post('Branch')
  async branch_List(@Body() data) {
    return await this.PumpCommonService.branch_List(data)
  }
}
