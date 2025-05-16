"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const moment = require("moment");
const auth_service_1 = require("../auth/auth.service");
const config_config_1 = require("../config/config.config");
const sql_sql_1 = require("../database/sql.sql");
let AdminService = class AdminService {
    constructor(config, authService) {
        this.config = config;
        this.authService = authService;
    }
    async getRole(data) {
        return await this.config.executeUserQuery(`SELECT * FROM ROLES WHERE CODE = ${data.CODE}`);
    }
    async newRole(data) {
        if (data.CODE == undefined) {
            let code = "select top 1 CODE from Roles order by CODE desc";
            code = await this.config.executeUserQuery(code);
            code = code[0].CODE + 1;
            data["CODE"] = code;
            data["tableName"] = "Roles";
            return await this.config.insertUserData(data);
        }
        else {
            let code = data.CODE;
            await this.config.executeUserQuery(`DELETE FROM Roles WHERE CODE = ${code}`);
            data["CODE"] = code;
            data["tableName"] = "Roles";
            return await this.config.insertUserData(data);
        }
    }
    async getUser(data) {
        return await this.config.executeUserQuery(`SELECT * FROM USERS WHERE USER_ID = '${data.USER_ID}'`);
    }
    async getNewUser(data) {
        data = data.data;
        let sysDate = await this.config.executeUserQuery(`Get_SYSDATETIME`);
        let dsExistingData = [];
        if (data['USER_ID']) {
            dsExistingData = await this.config.executeUserQuery(`SELECT * FROM USERS WHERE USER_ID = '${data['USER_ID']}'`);
            await this.config.executeUserQuery(`DELETE FROM USERS WHERE USER_ID = '${data['USER_ID']}'`);
        }
        data['COMPANY_ID'] = data.COMPANY_ID;
        data['USER_ID'] = data.USER_ID;
        data['NAME'] = data.USER_NAME;
        if (data['PASSWORD']) {
            data['PASSWORD'] = await this.authService.encrypt3DES(data.PASSWORD);
        }
        else {
        }
        data['DEPARTMENT'] = null;
        data['DESG_CODE'] = null;
        data['CELL_NO'] = null;
        data['EMAIL_ID'] = null;
        data['MODULE_NO'] = 99;
        data['EMP_CODE'] = data.EMP_CODE;
        data['CREATED_DATE'] = sysDate[0][''].slice(0, 8);
        data['VALID_TILL_DATE'] = 0;
        data['STATUS_CODE'] = 0;
        data["tableName"] = "Users";
        return await this.config.insertUserData(data);
    }
    async getUserSpdata(data) {
        let object = {
            name: data.name,
            params: data.params
        };
        return await this.config.execUserSpWithParams(object, data.multiflag);
    }
    async getAssignMenuAccessRole(data) {
        let obj2 = {
            name: "Sel_RoleAccess",
            params: `@chrOption=N'1',@chrCompanyID=N'101',@chrRoleCode=N'${data.RoleCode}',@chrParent=N'0',@intModuleNo=${data.ModuleNo}`
        };
        let parrent = await this.getUserSpdata(obj2);
        let promises = parrent.map(async (ele) => {
            ele["expand"] = false;
            let obj3 = {
                name: "Sel_RoleAccess",
                params: `@chrOption=N'1',@chrCompanyID=N'101',@chrRoleCode=N'101001',@chrParent=N'${ele.MENU_KEY}',@intModuleNo=${data.ModuleNo}`
            };
            let temp = await this.getUserSpdata(obj3);
            let updatedTemp = temp.map((item) => {
                let newItem = Object.assign(Object.assign({}, item), { checked: true });
                return newItem;
            });
            ele["childs"] = updatedTemp;
            return ele;
        });
        let ori_result = await Promise.all(promises);
        let result = ori_result.map(x => Object.assign({}, x));
        let childPromises = [];
        for (let ele12 of result) {
            let promise = this.config.executeUserQuery(`select MENU_KEY, MENU_CAPTION, NULL AS IS_AVAILABLE, MENU_OPTION_TYPE from menus where PARENT = ${ele12.MENU_KEY}`);
            ele12.childs = await promise;
            childPromises.push(ele12);
        }
        let child_result = await Promise.all(childPromises);
        let mergedChilds = ori_result.map(item => {
            let foundItem = child_result.find(child => child.MENU_KEY === item.MENU_KEY);
            if (foundItem) {
                return Object.assign(Object.assign({}, item), { childs: item.childs.concat(foundItem.childs.filter(child => !item.childs.find(existing => existing.MENU_KEY === child.MENU_KEY))) });
            }
            else {
                return item;
            }
        });
        return await ori_result;
    }
    async hash(password) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        return hash;
    }
    async changePassword(data) {
        if (data) {
            let old = await this.config.executeUserQuery(`SELECT * FROM USERS WHERE USER_ID = '${data.USER_ID}'`);
            if (old.length == 0) {
                return { status_code: 0, "message": "Invalid Old User" };
            }
            else {
                let temp = await this.authService.encrypt3DES(data.OLD_PASSWORD);
                if (temp == old[0].PASSWORD) {
                    let NEW_PASSWORD = await this.authService.encrypt3DES(data.NEW_PASSWORD);
                    await this.config.executeUserQuery(`UPDATE USERS SET PASSWORD = '${NEW_PASSWORD}' , VALID_TILL_DATE = '${data.VALID_TILL_DATE}' WHERE USER_ID = '${data.USER_ID}'`);
                    await this.config.executeUserQuery(`INSERT INTO USERSLOG (COMPANY_ID,TRAN_DATE,USER_ID,OLD_PASSWORD,NEW_PASSWORD,TYPE,SYSCHNG_DATETIME,SYSCHNG_LOGIN, REMARK) VALUES(${data.COMPANY_ID}, ${moment().format("YYYYMMDD")}, '${data.USER_ID}','${await this.authService.encrypt3DES(data.OLD_PASSWORD)}', '${await this.authService.encrypt3DES(data.NEW_PASSWORD)}', NULL, '${moment().format('YYYYMMDDHH:mm:ss')}', '${data.USER_ID}', 'Change Password')`);
                    return { status_code: 1, "message": "Password Reset Successfully." };
                }
                else {
                    return { status_code: 0, "message": "Invalid Old Password" };
                }
            }
        }
    }
    async updateAssignUserWiseRoles(data) {
        await this.config.executeUserQuery(`exec Del_UserRoles @chrCompanyID=101,@chrUserId=N'${data.UserId}'`);
        data.RoleCode.forEach(async (element) => {
            await this.config.executeUserQuery(`exec Ins_UserRoles @chrCompanyID=N'101',@chrUserId=N'${data.UserId}',@chrRoleCode=N'${element}'`);
        });
    }
    async getEmpDrp() {
        return await this.config.executeQuery(`Get_HelpList '101','MSTCOMMEMPLOYEE','','CODE, UPPER(NAME) AS NAME, PARENT_CODE, SUB_GLACNO, DISCLEVEL_CODE, REGION_CODE','STATUS_CODE = 0  And STATUS_CODE=0','NAME',1`);
    }
    async resetPassword(data) {
        return await this.config.executeUserQuery(`UPDATE USERS SET NEW_PASSWORD = '${await this.hash('123456')}' WHERE USER_ID = '${data.USER_ID}'`);
    }
    async enableDisableUser(data) {
        return await this.config.executeUserQuery(`UPDATE USERS SET STATUS_CODE = '${data.STATUS_CODE}' WHERE USER_ID = '${data.USER_ID}'`);
    }
    async updateBusinessInformation(data) {
        let queryArray = new Array();
        let dataset2 = {};
        dataset2 = {
            "data": data._CNFCOMPANY,
            "condition": [{
                    "COMPANY_ID": data._CNFCOMPANY.COMPANY_ID
                }],
            "tableName": "CNFCOMPANY"
        };
        queryArray.push(await this.config.updateData(dataset2, 'user'));
        return await this.config.executeInsertQuery(queryArray);
    }
    async getMenusModuleWise(body) {
        const { MODULE, ROLE_CODE } = body;
        const [modules, menus, roleAccess] = await Promise.all([
            this.config.executeUserQuery(`
        SELECT MODULE_NO as id, MODULE_NAME as label 
        FROM Modules 
        WHERE STATUS_CODE = 0 AND MODULE_NO IN (${MODULE})
      `),
            this.config.executeUserQuery(`
        SELECT MODULE_NO, MENU_KEY as id, MENU_CAPTION as label, MENU_NAV_PAGE as link, PARENT, IS_VISIBLE
        FROM Menus
        WHERE MODULE_NO IN (${MODULE}) AND IS_VISIBLE = 0
      `),
            this.config.executeUserQuery(`
        SELECT MENU_KEY 
        FROM RoleAccess 
        WHERE ROLE_CODE = ${ROLE_CODE}
      `)
        ]);
        const allowedMenus = new Set(roleAccess.map(ra => ra.MENU_KEY));
        const menuMap = new Map();
        menus.forEach(menu => {
            menu.isAllow = allowedMenus.has(menu.id);
            if (!menuMap.has(menu.id))
                menuMap.set(menu.id, menu);
        });
        menus.forEach(menu => {
            if (menu.PARENT !== 0) {
                const parentMenu = menuMap.get(menu.PARENT);
                if (parentMenu) {
                    if (!parentMenu.subItems)
                        parentMenu.subItems = [];
                    parentMenu.subItems.push(menu);
                }
            }
        });
        for (let module of modules) {
            module.subItems = menus.filter(menu => menu.MODULE_NO === module.id && menu.PARENT === 0);
        }
        return modules;
    }
    async updateMenusModuleWise(data) {
        await this.config.executeUserQuery(`delete from RoleAccess where ROLE_CODE = ${data.ROLE_CODE}`);
        for (let item of data.data) {
            if (item.hasOwnProperty("subItems")) {
                for (let item_subItem of item.subItems) {
                    if (item_subItem.hasOwnProperty("subItems")) {
                        for (let item_subItemSubItem of item_subItem.subItems) {
                            if (item_subItemSubItem.hasOwnProperty("id")) {
                                if (item_subItemSubItem.isAllow) {
                                    let q = `INSERT INTO RoleAccess (COMPANY_ID	,ROLE_CODE	,MODULE_NO	, MENU_KEY) VALUES(${data.COMPANY_ID}, ${data.ROLE_CODE},${item.id},${item_subItemSubItem.id})`;
                                    await this.config.executeUserQuery(q);
                                }
                            }
                        }
                    }
                    else {
                        if (item_subItem.hasOwnProperty("id")) {
                            if (item_subItem.isAllow) {
                                let q = `INSERT INTO RoleAccess (COMPANY_ID	,ROLE_CODE	,MODULE_NO	, MENU_KEY) VALUES(${data.COMPANY_ID}, ${data.ROLE_CODE},${item.id},${item_subItem.id})`;
                                await this.config.executeUserQuery(q);
                            }
                        }
                    }
                }
            }
        }
    }
    async db_Backup(path) {
        await this.config.executeQuery(`exec sp_backupDb @dbname=N'${config_config_1.__MSSQL_DATABASE_MAIN}',@filepath=N'${path.MAIN_DATABASE_BACKUP_PATH}'`);
        await this.config.executeQuery(`exec sp_backupDb @dbname=N'${config_config_1.__MSSQL_DATABASE_USER}',@filepath=N'${path.USER_DATABASE_BACKUP_PATH}'`);
        return { status: true };
    }
    async checkUSER_ID(body) {
        return await this.config.executeUserQuery(`select COMPANY_ID, NAME, USER_ID from USERS WHERE USER_ID = '${body.USER_ID}'`);
    }
    async insertUserRoles(data) {
        let USRUserRoles = data.USRUserRoles;
        let USRUserRoles_Deleted = data.USRUserRoles_Deleted;
        for (let item of USRUserRoles_Deleted) {
            await this.config.executeUserQuery(`DELETE FROM UserRoles WHERE USER_ID = '${data.USER_ID}' AND ROLE_CODE = ${item.ROLE_CODE}`);
        }
        if (USRUserRoles.length > 0) {
            await this.config.executeUserQuery(`DELETE FROM UserRoles WHERE USER_ID = '${data.USER_ID}'`);
            for (let item of USRUserRoles) {
                await this.config.executeUserQuery(`INSERT INTO UserRoles (COMPANY_ID, USER_ID, ROLE_CODE) VALUES('${item.COMPANY_ID}','${item.USER_ID}','${item.ROLE_CODE}')`);
            }
        }
    }
    async insertCallType(body) {
        let MSTCOMMCALLTYPE = body.MSTCOMMCALLTYPE;
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        if (MSTCOMMCALLTYPE.CODE) {
            await this.config.executeQuery(`DELETE FROM MSTCOMMCALLTYPE WHERE CODE = ${MSTCOMMCALLTYPE.CODE}`);
            MSTCOMMCALLTYPE['SYSCHNG_DATETIME'] = sysDate[0][''];
        }
        else {
            let code = this.config.executeQuery(`exec Get_Next_Master_Code @COMPANY_ID='10 ',@TABLE_NAME='MSTCOMMCALLTYPE',@Code_Colum='CODE',@Code_Len=6,@Code_Prefix=''`);
            MSTCOMMCALLTYPE["CODE"] = code[0][''];
            MSTCOMMCALLTYPE['SYSADD_DATETIME'] = sysDate[0][''];
        }
        MSTCOMMCALLTYPE["tableName"] = "MSTCOMMCALLTYPE";
        await this.config.insertData(MSTCOMMCALLTYPE);
    }
    async updateCNFCOMPANY(data) {
        let tableName = "CNFCOMPANY";
        let COMPANY_ID = data.COMPANY_ID;
        delete data['COMPANY_ID'];
        let dataset = {};
        dataset = {
            "data": data,
            "condition": [{
                    "COMPANY_ID": COMPANY_ID
                }],
            "tableName": tableName
        };
        return await this.config.executeInsertQuery([await this.config.updateData(dataset)]);
    }
};
exports.AdminService = AdminService;
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminService.prototype, "insertCallType", null);
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sql_sql_1.SQL,
        auth_service_1.AuthService])
], AdminService);
//# sourceMappingURL=admin.service.js.map