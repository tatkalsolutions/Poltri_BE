"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionListModule = void 0;
const common_1 = require("@nestjs/common");
const transaction_list_service_1 = require("./transaction-list.service");
const transaction_list_controller_1 = require("./transaction-list.controller");
const sql_sql_1 = require("../../database/sql.sql");
let TransactionListModule = class TransactionListModule {
};
exports.TransactionListModule = TransactionListModule;
exports.TransactionListModule = TransactionListModule = __decorate([
    (0, common_1.Module)({
        controllers: [transaction_list_controller_1.TransactionListController],
        providers: [transaction_list_service_1.TransactionListService, sql_sql_1.SQL],
    })
], TransactionListModule);
//# sourceMappingURL=transaction-list.module.js.map