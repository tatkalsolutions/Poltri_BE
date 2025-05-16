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
exports.MukhyaVibhagController = void 0;
const common_1 = require("@nestjs/common");
const mukhya_vibhag_service_1 = require("./mukhya_vibhag.service");
let MukhyaVibhagController = class MukhyaVibhagController {
    constructor(mukhyaVibhagService) {
        this.mukhyaVibhagService = mukhyaVibhagService;
    }
    async getSmartTableData(data) {
        return await this.mukhyaVibhagService.getSmartTableData(data.CompUnit, data.MenuDocNo, data.StartDate, data.EndDate, data.UserID);
    }
    async insMaterialStockOpeningBalance(data) {
        return await this.mukhyaVibhagService.insMaterialStockOpeningBalance(data);
    }
    async getInsertData(data) {
        return await this.mukhyaVibhagService.mukhyaVibhagInsert(data.table_TRNACCTMATH, data.table_TRNACCTPOST, data.objREFHeader, data.objREFAcPost);
    }
    async getExistingTransactionData(data) {
        return await this.mukhyaVibhagService.getExistingTransactionData(data);
    }
    async mukhyaVibhagTwoObj_Insert(data) {
        return await this.mukhyaVibhagService.mukhyaVibhagTwoObj_Insert(data.objFINHeader, data.objFINAcPost, data.objREFHeader, data.objREFAcPost);
    }
    async Sel_ApprovalTransactionsFinance(data) {
        return await this.mukhyaVibhagService.Sel_ApprovalTransactionsFinance(data);
    }
    async kharchMagniVouchrInsert(data) {
        return await this.mukhyaVibhagService.kharchMagniVouchrInsert(data.objFINHeader, data.objFINAcPost, data.objREFHeader, data.objREFAcPost);
    }
};
exports.MukhyaVibhagController = MukhyaVibhagController;
__decorate([
    (0, common_1.Post)('/Sel_TransactionsFinance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MukhyaVibhagController.prototype, "getSmartTableData", null);
__decorate([
    (0, common_1.Post)('/insMaterialStockOpeningBalance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MukhyaVibhagController.prototype, "insMaterialStockOpeningBalance", null);
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MukhyaVibhagController.prototype, "getInsertData", null);
__decorate([
    (0, common_1.Post)('/getExistingTransactionData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MukhyaVibhagController.prototype, "getExistingTransactionData", null);
__decorate([
    (0, common_1.Post)('/fourobjinsert'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MukhyaVibhagController.prototype, "mukhyaVibhagTwoObj_Insert", null);
__decorate([
    (0, common_1.Post)('/Sel_ApprovalTransactionsFinance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MukhyaVibhagController.prototype, "Sel_ApprovalTransactionsFinance", null);
__decorate([
    (0, common_1.Post)('/kharchMagniVouchr'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MukhyaVibhagController.prototype, "kharchMagniVouchrInsert", null);
exports.MukhyaVibhagController = MukhyaVibhagController = __decorate([
    (0, common_1.Controller)('mukhya-vibhag'),
    __metadata("design:paramtypes", [mukhya_vibhag_service_1.MukhyaVibhagService])
], MukhyaVibhagController);
//# sourceMappingURL=mukhya_vibhag.controller.js.map