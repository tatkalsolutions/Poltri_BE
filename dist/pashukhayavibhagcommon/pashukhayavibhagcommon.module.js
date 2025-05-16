"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PashukhayavibhagcommonModule = void 0;
const common_1 = require("@nestjs/common");
const pashukhayavibhagcommon_service_1 = require("./pashukhayavibhagcommon.service");
const pashukhayavibhagcommon_controller_1 = require("./pashukhayavibhagcommon.controller");
const sql_sql_1 = require("../database/sql.sql");
let PashukhayavibhagcommonModule = class PashukhayavibhagcommonModule {
};
exports.PashukhayavibhagcommonModule = PashukhayavibhagcommonModule;
exports.PashukhayavibhagcommonModule = PashukhayavibhagcommonModule = __decorate([
    (0, common_1.Module)({
        controllers: [pashukhayavibhagcommon_controller_1.PashukhayavibhagcommonController],
        providers: [pashukhayavibhagcommon_service_1.PashukhayavibhagcommonService, sql_sql_1.SQL],
    })
], PashukhayavibhagcommonModule);
//# sourceMappingURL=pashukhayavibhagcommon.module.js.map