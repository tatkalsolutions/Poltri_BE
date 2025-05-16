"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpCommonModule = void 0;
const common_1 = require("@nestjs/common");
const pump_common_controller_1 = require("./pump-common.controller");
const pump_common_service_1 = require("./pump-common.service");
const sql_sql_1 = require("../../database/sql.sql");
let PumpCommonModule = class PumpCommonModule {
};
exports.PumpCommonModule = PumpCommonModule;
exports.PumpCommonModule = PumpCommonModule = __decorate([
    (0, common_1.Module)({
        controllers: [pump_common_controller_1.PumpCommonController],
        providers: [pump_common_service_1.PumpCommonService, sql_sql_1.SQL]
    })
], PumpCommonModule);
//# sourceMappingURL=pump-common.module.js.map