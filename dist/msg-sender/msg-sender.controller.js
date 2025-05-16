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
exports.MsgSenderController = void 0;
const msg_sender_service_1 = require("./msg-sender.service");
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
let MsgSenderController = class MsgSenderController {
    constructor(msgSenderService) {
        this.msgSenderService = msgSenderService;
    }
    async sendMail(to, subject, text, htmlContent, attachments) {
        await this.msgSenderService.sendMail(to, subject, text, htmlContent, attachments);
        return { message: 'Email sent successfully' };
    }
    uploadFile(file) {
        return { message: 'File uploaded successfully', file };
    }
};
exports.MsgSenderController = MsgSenderController;
__decorate([
    (0, common_1.Post)('Email_send'),
    __param(0, (0, common_1.Body)('to')),
    __param(1, (0, common_1.Body)('subject')),
    __param(2, (0, common_1.Body)('text')),
    __param(3, (0, common_1.Body)('htmlContent')),
    __param(4, (0, common_1.Body)('attachments')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Array]),
    __metadata("design:returntype", Promise)
], MsgSenderController.prototype, "sendMail", null);
__decorate([
    (0, common_1.Post)('upload_single'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: 'uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, file.originalname);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MsgSenderController.prototype, "uploadFile", null);
exports.MsgSenderController = MsgSenderController = __decorate([
    (0, common_1.Controller)('sender'),
    __metadata("design:paramtypes", [msg_sender_service_1.MsgSenderService])
], MsgSenderController);
//# sourceMappingURL=msg-sender.controller.js.map