"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgSenderModule = void 0;
const common_1 = require("@nestjs/common");
const msg_sender_service_1 = require("./msg-sender.service");
const msg_sender_controller_1 = require("./msg-sender.controller");
const axios_1 = require("@nestjs/axios");
const sql_sql_1 = require("../database/sql.sql");
let MsgSenderModule = class MsgSenderModule {
};
exports.MsgSenderModule = MsgSenderModule;
exports.MsgSenderModule = MsgSenderModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [msg_sender_controller_1.MsgSenderController],
        providers: [msg_sender_service_1.MsgSenderService, sql_sql_1.SQL]
    })
], MsgSenderModule);
//# sourceMappingURL=msg-sender.module.js.map