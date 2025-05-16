"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MukhyaVibhagModule = void 0;
const common_1 = require("@nestjs/common");
const mukhya_vibhag_controller_1 = require("./mukhya_vibhag.controller");
const mukhya_vibhag_service_1 = require("./mukhya_vibhag.service");
const sql_sql_1 = require("../database/sql.sql");
let MukhyaVibhagModule = class MukhyaVibhagModule {
};
exports.MukhyaVibhagModule = MukhyaVibhagModule;
exports.MukhyaVibhagModule = MukhyaVibhagModule = __decorate([
    (0, common_1.Module)({
        controllers: [mukhya_vibhag_controller_1.MukhyaVibhagController],
        providers: [mukhya_vibhag_service_1.MukhyaVibhagService, sql_sql_1.SQL]
    })
], MukhyaVibhagModule);
//# sourceMappingURL=mukhya_vibhag.module.js.map