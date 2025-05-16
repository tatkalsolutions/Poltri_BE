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
    async insRequisitionSlip(data) {
        return await this.transactionListService.insRequisitionSlip(data);
    }
    async insIssueAgslip(data) {
        return await this.transactionListService.insIssueAgslip(data);
    }
    async insDirectIssue(data) {
        return await this.transactionListService.insDirectIssue(data);
    }
    async insBGRNDirect(data) {
        return await this.transactionListService.insBGRNDirect(data);
    }
};
exports.TransactionListController = TransactionListController;
__decorate([
    (0, common_1.Post)('/insRequisitionSlip'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionListController.prototype, "insRequisitionSlip", null);
__decorate([
    (0, common_1.Post)('/insIssueAgslip'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionListController.prototype, "insIssueAgslip", null);
__decorate([
    (0, common_1.Post)('/insDirectIssue'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionListController.prototype, "insDirectIssue", null);
__decorate([
    (0, common_1.Post)('/insBGRNDirect'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionListController.prototype, "insBGRNDirect", null);
exports.TransactionListController = TransactionListController = __decorate([
    (0, common_1.Controller)('pashukhadyatransaction-list'),
    __metadata("design:paramtypes", [transaction_list_service_1.TransactionListService])
], TransactionListController);
//# sourceMappingURL=transaction-list.controller.js.map