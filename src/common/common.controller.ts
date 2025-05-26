import { CommonService } from './common.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  BadRequestException, Body, Controller, Delete, Get, Param,
  Patch, Post, Query, Res, UploadedFile, UseInterceptors, UploadedFiles
} from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
import { SQL } from 'src/database/sql.sql';

@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly config: SQL,
  ) { }

  @Get('/MenusNav')
  getMenuNavDetails() {
    return this.commonService.menuNavDetails()
  }

  @Post('/menuDetails')
  menuDetails(@Body() data) {
    return this.commonService.menuDetails(data);
  }

  @Post('/MenuDocWiseNevigation')
  menuDocWiseNevigation(@Body() data) {
    return this.commonService.menuDocWiseNevigation(data);
  }
  @Post('/MSTMenuDocWiseNevigation')
  MSTDocWiseNevigation(@Body() data) {
    return this.commonService.MSTDocWiseNevigation(data);
  }
  @Post('/GetHelpList')
  getHelpList(@Body() data) {
    return this.commonService.getHelpList(data);
  }
  @Post('/MenuNevigationBtnAccessDataAsPerUser')
  getUserAccess(@Body() data) {
    return this.commonService.getUserAccess(data);
  }
  @Post('/GET_VOUTYPE_FROM_MENUDOC')
  async GET_VOUTYPE_FROM_MENUDOC(@Body() data) {
    return this.commonService.GET_VOUTYPE_FROM_MENUDOC(data);
  }

  @Post('/getSpData')
  async getSpData(@Body() data) {
    return this.commonService.getSpData(data);
  }

  @Post('/getSp')
  async getSp(@Body() data) {
    return this.commonService.getSp(data);
  }
  @Post('/getUserSpData')
  async getUserSpData(@Body() data) {
    return this.commonService.getUserSpData(data);
  }
  @Post('/Sel_MasterCodeList')
  Sel_MasterCodeList(@Body() data) {
    return this.commonService.Sel_MasterCodeList(data);
  }
  @Post('/Get_TableFieldswithClause')
  Get_TableFieldswithClause(@Body() data) {
    return this.commonService.Get_TableFieldswithClause(data);
  }
  //------------------* MSTMATERIALS TAble insert -------------------------//
  @Post('/MstMaterials')
  async insert_MstMaterials(@Body() data) {
    return this.commonService.insert_MstMaterials(data);
  }

  //------------------* MSTCOMMUNIT TAble insert -------------------------//
  @Post('/MstCommunit')
  async insert_MstCommunit(@Body() data) {
    return this.commonService.insert_MstCommunit(data);
  }

  @Post('/DeleteQury')
  async DeleteQury(@Body() data) {
    return this.commonService.DeleteQury(data);
  }


  @Post('/MASTDeleteQury')
  async MASTDeleteQury(@Body() data) {
    return this.commonService.MASTDeleteQury(data);
  }
  //------------------* MSTMATGROUP TAble insert -------------------------//
  @Post('/MstMatGroup')
  async insert_MstMatGroup(@Body() data) {
    return this.commonService.insert_MstMatGroup(data);
  }

  //------------------* CNFMATERIALS TAble insert -------------------------//
  @Post('/CNFMATERIALS')
  async insert_CNFMATERIALS(@Body() data) {
    return this.commonService.insert_CNFMATERIALS(data);
  }
  //------------------* MSTMATLOCATION TAble insert -------------------------//
  @Post('/MstMatLocation')
  async insert_MstMatLocation(@Body() data) {
    return this.commonService.insert_MstMatLocation(data);
  }
  //------------------* CNFRATEEXCISE TAble insert -------------------------//
  @Post('/CnfRateExcise')
  async insert_CnfRateExcise(@Body() data) {
    return this.commonService.insert_CnfRateExcise(data);
  }
  //------------------* GSTRATECATEGORY TAble insert -------------------------//
  @Post('/GstRateCategory')
  async insert_GstRateCategory(@Body() data) {
    return this.commonService.insert_GstRateCategory(data);
  }
  //------------------* MSTACCTGL TAble insert -------------------------//
  @Post('/Ins_MSTACCTGL')
  async insert_MSTACCTGL(@Body() data) {
    return this.commonService.insert_MSTACCTGL(data);
  }
  //------------------*  TAble insert -------------------------//
  @Post('/Ins_ItarMaster')
  async Ins_ItarMaster(@Body() data) {
    return this.commonService.Ins_ItarMaster(data);
  }

  //------------------* MSTCOMMGODOWN TAble insert -------------------------//
  @Post('/MstMSTCOMMGODOWN')
  async insert_MstMSTCOMMGODOWN(@Body() data) {
    return this.commonService.insert_MstMSTCOMMGODOWN(data);
  }
  // --* MSTACCTGLSUBGL TAble insert -------------------------//
  @Post('/GLSubGLInsert')
  async insert_glsubgl(@Body() data) {
    return this.commonService.insert_glsubgl(data);
  }
  @Post('/chckDuplicateChllnNO')
  async chckDuplicateChllnNO(@Body() data) {
    return await this.commonService.chckDuplicateChllnNO(data)
  }
  @Get('/GstPostKeyData')
  async getPostKeyData() {
    return this.commonService.getPostKeyData();
  }
  @Get('/getGstCategoryData')
  async getGstCategoryData() {
    return this.commonService.getGstCategoryData();
  }
  @Post('/ConstantAccount')
  async getConstantAccount(@Body() data) {
    return this.commonService.getConstantAccount(data);
  }

  @Post('/Sel_GetMaterialsGSTList')
  async Sel_GetMaterialsGSTList(@Body() data) {
    return await this.commonService.getMaterialDetails(data);
  }
  @Post('/getPostKeyDataIdWise')
  async getPostKeyDataIdWise(@Body() data) {
    return this.commonService.getPostKeyDataIdWise(data);
  }
  @Post('/Sel_TransactionsFinance')
  async Sel_TransactionsFinance(@Body() data) {
    return this.commonService.Sel_TransactionsFinance(data);
  }
  @Post('/Sel_ControlAcctGl')
  async Sel_ControlAcctGl(@Body() data) {
    return this.commonService.Sel_ControlAcctGl(data);
  }

  @Post('/Ins_LedgerControlAcc')
  async Ins_LedgerControlAcc(@Body() data) {
    return this.commonService.Ins_LedgerControlAcc(data);
  }
  @Post('/Sel_ReportHelp')
  async Sel_ReportHelp(@Body() data) {
    return this.commonService.Sel_ReportHelp(data);
  }
  @Post('/Sel_ReportLinking')
  async Sel_ReportLinking(@Body() data) {
    return this.commonService.Sel_ReportLinking(data);
  }
  //------------------* CNFREPORTD TAble insert -------------------------//
  @Post('/CNFREPORTD')
  async insert_CNFREPORTD(@Body() data) {
    return this.commonService.insert_CNFREPORTD(data);
  }

  @Post('/MSTACCTALLOCATION')
  async insert_MSTACCTALLOCATION(@Body() data) {
    return this.commonService.insert_MSTACCTALLOCATION(data);
  }
  //------------------* MSTCOMMTERMS TAble insert -------------------------//
  @Post('/MstCommTerms')
  async insert_MstCommTerms(@Body() data) {
    return this.commonService.insert_MstCommTerms(data);
  }
  @Post('/CNFPOSTKEYSGL')
  async insert_CNFPOSTKEYSGL(@Body() data) {
    return this.commonService.insert_CNFPOSTKEYSGL(data);
  }
  //-------------------* Ledger Posting Details ---------------------------//
  @Post('/ledgerPosting')
  async getLedgerPosting(@Body() data) {
    return await this.config.executeQueryForMultTable(`exec Sel_AcctPostingDetail ${data.TranNO}`);
  }
}

