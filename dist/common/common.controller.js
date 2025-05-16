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
exports.CommonController = void 0;
const common_service_1 = require("./common.service");
const common_1 = require("@nestjs/common");
let CommonController = class CommonController {
    constructor(commonService) {
        this.commonService = commonService;
    }
    getMenuNavDetails() {
        return this.commonService.menuNavDetails();
    }
    menuDetails(data) {
        return this.commonService.menuDetails(data);
    }
    menuDocWiseNevigation(data) {
        return this.commonService.menuDocWiseNevigation(data);
    }
    MSTDocWiseNevigation(data) {
        return this.commonService.MSTDocWiseNevigation(data);
    }
    getHelpList(data) {
        return this.commonService.getHelpList(data);
    }
    getUserAccess(data) {
        return this.commonService.getUserAccess(data);
    }
    async GET_VOUTYPE_FROM_MENUDOC(data) {
        return this.commonService.GET_VOUTYPE_FROM_MENUDOC(data);
    }
    async getSpData(data) {
        return this.commonService.getSpData(data);
    }
    async getSp(data) {
        return this.commonService.getSp(data);
    }
    async getUserSpData(data) {
        return this.commonService.getUserSpData(data);
    }
    Sel_MasterCodeList(data) {
        return this.commonService.Sel_MasterCodeList(data);
    }
    Get_TableFieldswithClause(data) {
        return this.commonService.Get_TableFieldswithClause(data);
    }
    async insert_MstMaterials(data) {
        return this.commonService.insert_MstMaterials(data);
    }
    async insert_MstCommunit(data) {
        return this.commonService.insert_MstCommunit(data);
    }
    async DeleteQury(data) {
        return this.commonService.DeleteQury(data);
    }
    async MASTDeleteQury(data) {
        return this.commonService.MASTDeleteQury(data);
    }
    async insert_MstMatGroup(data) {
        return this.commonService.insert_MstMatGroup(data);
    }
    async insert_CNFMATERIALS(data) {
        return this.commonService.insert_CNFMATERIALS(data);
    }
    async insert_MstMatLocation(data) {
        return this.commonService.insert_MstMatLocation(data);
    }
    async insert_CnfRateExcise(data) {
        return this.commonService.insert_CnfRateExcise(data);
    }
    async insert_GstRateCategory(data) {
        return this.commonService.insert_GstRateCategory(data);
    }
    async insert_MSTACCTGL(data) {
        return this.commonService.insert_MSTACCTGL(data);
    }
    async Ins_ItarMaster(data) {
        return this.commonService.Ins_ItarMaster(data);
    }
    async insert_MstMSTCOMMGODOWN(data) {
        return this.commonService.insert_MstMSTCOMMGODOWN(data);
    }
    async insert_glsubgl(data) {
        return this.commonService.insert_glsubgl(data);
    }
    async chckDuplicateChllnNO(data) {
        return await this.commonService.chckDuplicateChllnNO(data);
    }
    async getPostKeyData() {
        return this.commonService.getPostKeyData();
    }
    async getGstCategoryData() {
        return this.commonService.getGstCategoryData();
    }
    async getConstantAccount(data) {
        return this.commonService.getConstantAccount(data);
    }
    async Sel_GetMaterialsGSTList(data) {
        return await this.commonService.getMaterialDetails(data);
    }
    async getPostKeyDataIdWise(data) {
        return this.commonService.getPostKeyDataIdWise(data);
    }
    async Sel_TransactionsFinance(data) {
        return this.commonService.Sel_TransactionsFinance(data);
    }
    async Sel_ControlAcctGl(data) {
        return this.commonService.Sel_ControlAcctGl(data);
    }
    async Ins_LedgerControlAcc(data) {
        return this.commonService.Ins_LedgerControlAcc(data);
    }
    async Sel_ReportHelp(data) {
        return this.commonService.Sel_ReportHelp(data);
    }
    async Sel_ReportLinking(data) {
        return this.commonService.Sel_ReportLinking(data);
    }
    async insert_CNFREPORTD(data) {
        return this.commonService.insert_CNFREPORTD(data);
    }
    async insert_MSTACCTALLOCATION(data) {
        return this.commonService.insert_MSTACCTALLOCATION(data);
    }
    async insert_MstCommTerms(data) {
        return this.commonService.insert_MstCommTerms(data);
    }
    async insert_CNFPOSTKEYSGL(data) {
        return this.commonService.insert_CNFPOSTKEYSGL(data);
    }
};
exports.CommonController = CommonController;
__decorate([
    (0, common_1.Get)('/MenusNav'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "getMenuNavDetails", null);
__decorate([
    (0, common_1.Post)('/menuDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "menuDetails", null);
__decorate([
    (0, common_1.Post)('/MenuDocWiseNevigation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "menuDocWiseNevigation", null);
__decorate([
    (0, common_1.Post)('/MSTMenuDocWiseNevigation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "MSTDocWiseNevigation", null);
__decorate([
    (0, common_1.Post)('/GetHelpList'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "getHelpList", null);
__decorate([
    (0, common_1.Post)('/MenuNevigationBtnAccessDataAsPerUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "getUserAccess", null);
__decorate([
    (0, common_1.Post)('/GET_VOUTYPE_FROM_MENUDOC'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "GET_VOUTYPE_FROM_MENUDOC", null);
__decorate([
    (0, common_1.Post)('/getSpData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getSpData", null);
__decorate([
    (0, common_1.Post)('/getSp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getSp", null);
__decorate([
    (0, common_1.Post)('/getUserSpData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getUserSpData", null);
__decorate([
    (0, common_1.Post)('/Sel_MasterCodeList'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "Sel_MasterCodeList", null);
__decorate([
    (0, common_1.Post)('/Get_TableFieldswithClause'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "Get_TableFieldswithClause", null);
__decorate([
    (0, common_1.Post)('/MstMaterials'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_MstMaterials", null);
__decorate([
    (0, common_1.Post)('/MstCommunit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_MstCommunit", null);
__decorate([
    (0, common_1.Post)('/DeleteQury'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "DeleteQury", null);
__decorate([
    (0, common_1.Post)('/MASTDeleteQury'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "MASTDeleteQury", null);
__decorate([
    (0, common_1.Post)('/MstMatGroup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_MstMatGroup", null);
__decorate([
    (0, common_1.Post)('/CNFMATERIALS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_CNFMATERIALS", null);
__decorate([
    (0, common_1.Post)('/MstMatLocation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_MstMatLocation", null);
__decorate([
    (0, common_1.Post)('/CnfRateExcise'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_CnfRateExcise", null);
__decorate([
    (0, common_1.Post)('/GstRateCategory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_GstRateCategory", null);
__decorate([
    (0, common_1.Post)('/Ins_MSTACCTGL'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_MSTACCTGL", null);
__decorate([
    (0, common_1.Post)('/Ins_ItarMaster'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "Ins_ItarMaster", null);
__decorate([
    (0, common_1.Post)('/MstMSTCOMMGODOWN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_MstMSTCOMMGODOWN", null);
__decorate([
    (0, common_1.Post)('/GLSubGLInsert'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_glsubgl", null);
__decorate([
    (0, common_1.Post)('/chckDuplicateChllnNO'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "chckDuplicateChllnNO", null);
__decorate([
    (0, common_1.Get)('/GstPostKeyData'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getPostKeyData", null);
__decorate([
    (0, common_1.Get)('/getGstCategoryData'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getGstCategoryData", null);
__decorate([
    (0, common_1.Post)('/ConstantAccount'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getConstantAccount", null);
__decorate([
    (0, common_1.Post)('/Sel_GetMaterialsGSTList'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "Sel_GetMaterialsGSTList", null);
__decorate([
    (0, common_1.Post)('/getPostKeyDataIdWise'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getPostKeyDataIdWise", null);
__decorate([
    (0, common_1.Post)('/Sel_TransactionsFinance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "Sel_TransactionsFinance", null);
__decorate([
    (0, common_1.Post)('/Sel_ControlAcctGl'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "Sel_ControlAcctGl", null);
__decorate([
    (0, common_1.Post)('/Ins_LedgerControlAcc'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "Ins_LedgerControlAcc", null);
__decorate([
    (0, common_1.Post)('/Sel_ReportHelp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "Sel_ReportHelp", null);
__decorate([
    (0, common_1.Post)('/Sel_ReportLinking'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "Sel_ReportLinking", null);
__decorate([
    (0, common_1.Post)('/CNFREPORTD'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_CNFREPORTD", null);
__decorate([
    (0, common_1.Post)('/MSTACCTALLOCATION'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_MSTACCTALLOCATION", null);
__decorate([
    (0, common_1.Post)('/MstCommTerms'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_MstCommTerms", null);
__decorate([
    (0, common_1.Post)('/CNFPOSTKEYSGL'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "insert_CNFPOSTKEYSGL", null);
exports.CommonController = CommonController = __decorate([
    (0, common_1.Controller)('common'),
    __metadata("design:paramtypes", [common_service_1.CommonService])
], CommonController);
//# sourceMappingURL=common.controller.js.map