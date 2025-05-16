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
exports.TransactionListController = void 0;
const common_1 = require("@nestjs/common");
const transaction_list_service_1 = require("./transaction-list.service");
let TransactionListController = class TransactionListController {
    constructor(transactionListService) {
        this.transactionListService = transactionListService;
    }
    async insAndStoreConsumption(data) {
        return await this.transactionListService.insAndStoreConsumption(data);
    }
    async insGhatTut(data) {
        return await this.transactionListService.insGhatTut(data);
    }
};
exports.TransactionListController = TransactionListController;
__decorate([
    (0, common_1.Post)('insAndStoreConsumption'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionListController.prototype, "insAndStoreConsumption", null);
__decorate([
    (0, common_1.Post)('insGhatTut'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionListController.prototype, "insGhatTut", null);
exports.TransactionListController = TransactionListController = __decorate([
    (0, common_1.Controller)('pashkhadyautpadan-list'),
    __metadata("design:paramtypes", [transaction_list_service_1.TransactionListService])
], TransactionListController);
//# sourceMappingURL=transaction-list.controller.js.map