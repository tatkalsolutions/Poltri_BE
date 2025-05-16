import { Body, Controller, Post } from '@nestjs/common';
import { DropdownService } from './dropdown.service';

@Controller('dairy_dropdown')
export class DropdownController {

  constructor(private readonly dropdownService: DropdownService) { }

  @Post('/BillDateSP')
  async billDateSP(@Body() data) {
    return this.dropdownService.billDateSP(data);
  }


  @Post('/billDate')
  async billDate(@Body() data) {
    return this.dropdownService.billDate(data);
  }
}
