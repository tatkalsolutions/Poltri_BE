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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const moment = require("moment");
const config_config_1 = require("../config/config.config");
let AdminController = class AdminController {
    constructor(service) {
        this.service = service;
    }
    async newRole(data) {
        return await this.service.newRole(data);
    }
    async getRole(data) {
        return await this.service.getRole(data);
    }
    async newUser(data) {
        return await this.service.getNewUser(data);
    }
    async getUser(data) {
        return await this.service.getUser(data);
    }
    async changePassword(body) {
        return await this.service.changePassword(body);
    }
    async updateAssignUserWiseRoles(data) {
        return await this.service.updateAssignUserWiseRoles(data);
    }
    async getAssignMenuAccessRole(body) {
        return await this.service.getAssignMenuAccessRole(body);
    }
    async getEmpDrp(body) {
        return await this.service.getEmpDrp();
    }
    async resetPassword(body) {
        return await this.service.resetPassword(body);
    }
    async enableDisableUser(body) {
        return await this.service.enableDisableUser(body);
    }
    async getBusinessInfo(data) {
        return await this.service.updateBusinessInformation(data);
    }
    async getMenusModuleWise(body) {
        return await this.service.getMenusModuleWise(body);
    }
    async updateMenusModuleWise(body) {
        return await this.service.updateMenusModuleWise(body);
    }
    async db_BackupPath(isLocal = false) {
        let obj = {};
        obj["DATABASE_BACKUP_PATH"] = `${config_config_1.DATABASE_BACKUP_PATH}\\`;
        if (isLocal) {
            if (config_config_1.__DATABASE_TYPE == "MSSQL") {
                obj["MAIN_DATABASE"] = `${config_config_1.__MSSQL_DATABASE_MAIN}`;
                obj["MAIN_DATABASE_BACKUP_PATH"] = `${config_config_1.DATABASE_BACKUP_PATH}\\${config_config_1.__MSSQL_DATABASE_MAIN}_${moment().format("YYYYMMDD")}.dmp`;
                obj["USER_DATABASE"] = `${config_config_1.__MSSQL_DATABASE_USER}`;
                obj["USER_DATABASE_BACKUP_PATH"] = `${config_config_1.DATABASE_BACKUP_PATH}\\${config_config_1.__MSSQL_DATABASE_USER}_${moment().format("YYYYMMDD")}.dmp`;
            }
            else {
            }
        }
        return obj;
    }
    async db_Backup() {
        let path = await this.db_BackupPath(true);
        return await this.service.db_Backup(path);
    }
    async checkUSER_ID(body) {
        return await this.service.checkUSER_ID(body);
    }
    async insertUserRoles(body) {
        return await this.service.insertUserRoles(body);
    }
    async insertCallType(body) {
        return await this.service.insertCallType(body);
    }
    async updateCNFCOMPANY(body) {
        return await this.service.updateCNFCOMPANY(body);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)("/newRole"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "newRole", null);
__decorate([
    (0, common_1.Post)("/getRole"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRole", null);
__decorate([
    (0, common_1.Post)("/newUser"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "newUser", null);
__decorate([
    (0, common_1.Post)("/getUser"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)("/changePassword"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)("/updateAssignUserWiseRoles"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAssignUserWiseRoles", null);
__decorate([
    (0, common_1.Post)("/getAssignMenuAccessRole"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAssignMenuAccessRole", null);
__decorate([
    (0, common_1.Post)("/getEmpDrp"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getEmpDrp", null);
__decorate([
    (0, common_1.Post)("/resetPassword"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)("/enableDisableUser"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "enableDisableUser", null);
__decorate([
    (0, common_1.Post)('/updatebusinessinfo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBusinessInfo", null);
__decorate([
    (0, common_1.Post)("getMenusModuleWise"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMenusModuleWise", null);
__decorate([
    (0, common_1.Post)("updateMenusModuleWise"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateMenusModuleWise", null);
__decorate([
    (0, common_1.Get)("db_BackupPath"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "db_BackupPath", null);
__decorate([
    (0, common_1.Get)("db_Backup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "db_Backup", null);
__decorate([
    (0, common_1.Post)('checkUSER_ID'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "checkUSER_ID", null);
__decorate([
    (0, common_1.Post)("insertUserRoles"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "insertUserRoles", null);
__decorate([
    (0, common_1.Post)("insertCallType"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "insertCallType", null);
__decorate([
    (0, common_1.Post)("updateCNFCOMPANY"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCNFCOMPANY", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map