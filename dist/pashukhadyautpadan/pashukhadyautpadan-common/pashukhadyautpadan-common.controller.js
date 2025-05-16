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
exports.PashukhadyautpadanCommonController = void 0;
const common_1 = require("@nestjs/common");
const pashukhadyautpadan_common_service_1 = require("./pashukhadyautpadan-common.service");
let PashukhadyautpadanCommonController = class PashukhadyautpadanCommonController {
    constructor(PashukhadyautpadanCommonService) {
        this.PashukhadyautpadanCommonService = PashukhadyautpadanCommonService;
    }
    async transaction_list(data) {
        return await this.PashukhadyautpadanCommonService.transactionList(data);
    }
    async Get_ProdType(data) {
        return await this.PashukhadyautpadanCommonService.Get_ProdType(data);
    }
    async Sel_ExistingTransactionsCFeedProd(data) {
        return await this.PashukhadyautpadanCommonService.Sel_ExistingTransactionsCFeedProd(data);
    }
};
exports.PashukhadyautpadanCommonController = PashukhadyautpadanCommonController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PashukhadyautpadanCommonController.prototype, "transaction_list", null);
__decorate([
    (0, common_1.Post)('ProdType'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PashukhadyautpadanCommonController.prototype, "Get_ProdType", null);
__decorate([
    (0, common_1.Post)('Sel_ExistingTransactionsCFeedProd'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PashukhadyautpadanCommonController.prototype, "Sel_ExistingTransactionsCFeedProd", null);
exports.PashukhadyautpadanCommonController = PashukhadyautpadanCommonController = __decorate([
    (0, common_1.Controller)('pashukhadyautpadan-common'),
    __metadata("design:paramtypes", [pashukhadyautpadan_common_service_1.PashukhadyautpadanCommonService])
], PashukhadyautpadanCommonController);
//# sourceMappingURL=pashukhadyautpadan-common.controller.js.map