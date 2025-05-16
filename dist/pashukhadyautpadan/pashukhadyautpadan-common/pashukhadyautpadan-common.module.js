"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PashukhadyautpadanCommonModule = void 0;
const common_1 = require("@nestjs/common");
const pashukhadyautpadan_common_controller_1 = require("./pashukhadyautpadan-common.controller");
const pashukhadyautpadan_common_service_1 = require("./pashukhadyautpadan-common.service");
const sql_sql_1 = require("../../database/sql.sql");
let PashukhadyautpadanCommonModule = class PashukhadyautpadanCommonModule {
};
exports.PashukhadyautpadanCommonModule = PashukhadyautpadanCommonModule;
exports.PashukhadyautpadanCommonModule = PashukhadyautpadanCommonModule = __decorate([
    (0, common_1.Module)({
        controllers: [pashukhadyautpadan_common_controller_1.PashukhadyautpadanCommonController],
        providers: [pashukhadyautpadan_common_service_1.PashukhadyautpadanCommonService, sql_sql_1.SQL]
    })
], PashukhadyautpadanCommonModule);
//# sourceMappingURL=pashukhadyautpadan-common.module.js.map