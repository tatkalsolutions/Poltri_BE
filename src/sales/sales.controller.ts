import { Body, Controller, Get, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }
  @Post('/mainSalesInsert')
  async mainSalesInsert(@Body() data) {
    return await this.salesService.mainSalesInsert(data.data);
  }
}
