import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import * as moment from 'moment';
import { __DATABASE_TYPE, __MSSQL_DATABASE_MAIN, __MSSQL_DATABASE_USER, DATABASE_BACKUP_PATH } from 'src/config/config.config';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) { }

  @Post("/newRole")
  async newRole(@Body() data) {
    return await this.service.newRole(data)
  }
  @Post("/getRole")
  async getRole(@Body() data) {
    return await this.service.getRole(data)
  }

  @Post("/newUser")
  async newUser(@Body() data) {
    return await this.service.getNewUser(data)
  }

  @Post("/getUser")
  async getUser(@Body() data) {
    return await this.service.getUser(data)
  }

  @Post("/changePassword")
  async changePassword(@Body() body) {
    return await this.service.changePassword(body);
  }


  @Post("/updateAssignUserWiseRoles")
  async updateAssignUserWiseRoles(@Body() data) {
    return await this.service.updateAssignUserWiseRoles(data);
  }

  @Post("/getAssignMenuAccessRole")
  async getAssignMenuAccessRole(@Body() body) {
    return await this.service.getAssignMenuAccessRole(body);
  }

  @Post("/getEmpDrp")
  async getEmpDrp(@Body() body) {
    return await this.service.getEmpDrp();
  }
  @Post("/resetPassword")
  async resetPassword(@Body() body) {
    return await this.service.resetPassword(body);
  }
  @Post("/enableDisableUser")
  async enableDisableUser(@Body() body) {
    return await this.service.enableDisableUser(body);
  }

  @Post('/updatebusinessinfo')
  async getBusinessInfo(@Body() data) {
    return await this.service.updateBusinessInformation(data);
  }

  @Post("getMenusModuleWise")
  async getMenusModuleWise(@Body() body) {
    return await this.service.getMenusModuleWise(body);
  }

  @Post("updateMenusModuleWise")
  async updateMenusModuleWise(@Body() body) {
    return await this.service.updateMenusModuleWise(body);
  }

  @Get("db_BackupPath")
  async db_BackupPath(isLocal: boolean = false) {
    let obj: any = {}
    obj["DATABASE_BACKUP_PATH"] = `${DATABASE_BACKUP_PATH}\\`;
    if (isLocal) {
      if (__DATABASE_TYPE == "MSSQL") {
        obj["MAIN_DATABASE"] = `${__MSSQL_DATABASE_MAIN}`;
        obj["MAIN_DATABASE_BACKUP_PATH"] = `${DATABASE_BACKUP_PATH}\\${__MSSQL_DATABASE_MAIN}_${moment().format("YYYYMMDD")}.dmp`;
        obj["USER_DATABASE"] = `${__MSSQL_DATABASE_USER}`;
        obj["USER_DATABASE_BACKUP_PATH"] = `${DATABASE_BACKUP_PATH}\\${__MSSQL_DATABASE_USER}_${moment().format("YYYYMMDD")}.dmp`;
      } else {

      }
    }
    return obj;
  }

  @Get("db_Backup")
  async db_Backup() {
    let path: any = await this.db_BackupPath(true);
    return await this.service.db_Backup(path);
  }

  @Post('checkUSER_ID')
  async checkUSER_ID(@Body() body) {
    return await this.service.checkUSER_ID(body);
  }

  @Post("insertUserRoles")
  async insertUserRoles(@Body() body) {
    return await this.service.insertUserRoles(body);
  }

  @Post("insertCallType")
  async insertCallType(@Body() body) {
    return await this.service.insertCallType(body);
  }
  @Post("updateCNFCOMPANY")
  async updateCNFCOMPANY(@Body() body) {
    return await this.service.updateCNFCOMPANY(body);
  }
}

