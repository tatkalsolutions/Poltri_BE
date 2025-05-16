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
exports.MsgSenderService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const axios_1 = require("@nestjs/axios");
const sql_sql_1 = require("../database/sql.sql");
const config_config_1 = require("../config/config.config");
const axios = require('axios').default;
let MsgSenderService = class MsgSenderService {
    constructor(sql, httpService) {
        this.sql = sql;
        this.httpService = httpService;
        this.__fromMail = config_config_1.__FROM_MAIL;
        this.__fromMail_Password = config_config_1.__FROM_MAIL_PASSWORD;
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: `mailto:${this.__fromMail}`,
                pass: this.__fromMail_Password,
            },
        });
    }
    async sendMail(to, subject, text, htmlContent, attachments) {
        const mailOptions = {
            from: `mailto:${this.__fromMail}`,
            to,
            subject,
            text,
            html: htmlContent,
            attachments,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        }
        catch (error) {
            console.error('Error sending email: ' + error);
        }
    }
};
exports.MsgSenderService = MsgSenderService;
exports.MsgSenderService = MsgSenderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sql_sql_1.SQL,
        axios_1.HttpService])
], MsgSenderService);
//# sourceMappingURL=msg-sender.service.js.map