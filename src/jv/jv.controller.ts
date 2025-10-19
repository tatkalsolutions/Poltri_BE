import { Body, Controller, Post } from '@nestjs/common';
import { JvService } from './jv.service';

@Controller('jv')
export class JvController {
  constructor(private readonly jvService: JvService) { }

  // @Post('/Sel_TransactionsCattleFeed')
  // async transaction_list(@Body() data) {
  //   return await this.jvService.transactionList(data);
  // }

  @Post('/insertJV')
  async insertJV(@Body() data) {
    return this.jvService.insertJV(data);
  }
  // @Post('/insertKachamalTapasni1')
  // async insertKachamalTapasni1(@Body() data) {
  //   return this.jvService.insertKachamalTapasni1(data);
  // }
}
