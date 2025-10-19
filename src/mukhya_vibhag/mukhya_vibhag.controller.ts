import { Body, Controller, Post } from '@nestjs/common';
import { MukhyaVibhagService } from './mukhya_vibhag.service';

@Controller('mukhya-vibhag')
export class MukhyaVibhagController {
  constructor(private readonly mukhyaVibhagService: MukhyaVibhagService) { }

  @Post('/Sel_TransactionsFinance')
  async getSmartTableData(@Body() data) {
    return await this.mukhyaVibhagService.getSmartTableData(
      data.CompUnit,
      data.MenuDocNo,
      data.StartDate,
      data.EndDate,
      data.UserID,
    );
  }

  @Post('/Sel_TransactionsFinance2')
  async getSmartTableData2(@Body() data) {
    return await this.mukhyaVibhagService.getSmartTableData2(
      data.CompUnit,
      data.MenuDocNo,
      data.StartDate,
      data.EndDate,
      data.UserID,
    );
  }

  @Post('/insMaterialStockOpeningBalance')
  async insMaterialStockOpeningBalance(@Body() data) {
    return await this.mukhyaVibhagService.insMaterialStockOpeningBalance(data);
  }

  @Post('/insert')
  async getInsertData(@Body() data) {
    // console.log('res1',data);
    return await this.mukhyaVibhagService.mukhyaVibhagInsert(
      data.table_TRNACCTMATH,
      data.table_TRNACCTPOST,
      data.objREFHeader,
      data.objREFAcPost,
    );
  }

  @Post('/getExistingTransactionData')
  async getExistingTransactionData(@Body() data) {
    return await this.mukhyaVibhagService.getExistingTransactionData(data);
  }
  @Post('/fourobjinsert')
  async mukhyaVibhagTwoObj_Insert(@Body() data) {
    return await this.mukhyaVibhagService.mukhyaVibhagTwoObj_Insert(
      data.objFINHeader,
      data.objFINAcPost,
      data.objREFHeader,
      data.objREFAcPost,
    );
  }

  @Post('/Sel_ApprovalTransactionsFinance')
  async Sel_ApprovalTransactionsFinance(@Body() data) {
    return await this.mukhyaVibhagService.Sel_ApprovalTransactionsFinance(data);
  }

  @Post('/kharchMagniVouchr')
  async kharchMagniVouchrInsert(@Body() data) {
    return await this.mukhyaVibhagService.kharchMagniVouchrInsert(
      data.objFINHeader,
      data.objFINAcPost,
      data.objREFHeader,
      data.objREFAcPost,
    );
  }

  @Post('/Sel_ExistingTransactionsFinance')
  async Sel_ExistingTransactionsFinance(@Body() data) {
    return await this.mukhyaVibhagService.Sel_ExistingTransactionsFinance(data);
  }
}
