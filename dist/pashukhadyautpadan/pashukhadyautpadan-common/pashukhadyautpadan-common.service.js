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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PashukhadyautpadanCommonService = void 0;
const common_1 = require("@nestjs/common");
const sql_sql_1 = require("../../database/sql.sql");
let PashukhadyautpadanCommonService = class PashukhadyautpadanCommonService {
    constructor(config) {
        this.config = config;
    }
    async transactionList(data) {
        let object = {
            name: 'Sel_TransactionsCFeedProd',
            params: [data.CompUnit, data.MenuDocNo, data.UserID, data.StartDate, data.EndDate]
        };
        return await this.config.execSpWithParams(object, 1);
    }
    async Get_ProdType(data) {
        let object = {
            name: 'Get_ProdType',
            params: [data.ProdType]
        };
        return await this.config.execSpWithParams(object);
    }
    async Sel_ExistingTransactionsCFeedProd(data) {
        let object = {
            name: 'Sel_ExistingTransactionsCFeedProdOld',
            params: [data.TranNo, data.TranSubType]
        };
        return await this.config.execSpWithParams(object, 1);
    }
};
exports.PashukhadyautpadanCommonService = PashukhadyautpadanCommonService;
exports.PashukhadyautpadanCommonService = PashukhadyautpadanCommonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sql_sql_1.SQL])
], PashukhadyautpadanCommonService);
//# sourceMappingURL=pashukhadyautpadan-common.service.js.map