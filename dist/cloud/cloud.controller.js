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
exports.CloudController = void 0;
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const cloud_service_1 = require("./cloud.service");
let CloudController = class CloudController {
    constructor(cloudService) {
        this.cloudService = cloudService;
    }
    createFolder(folderPath) {
        return this.cloudService.createFolder(folderPath);
    }
    listFiles(folderPath) {
        return this.cloudService.listFiles(folderPath);
    }
    getAllFolders() {
        return this.cloudService.getAllFolders();
    }
    uploadFile(file, folderName) {
        console.log(folderName);
        console.log(file);
        if (!folderName) {
            throw new common_1.BadRequestException('Folder name is required');
        }
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        return this.cloudService.uploadFile(folderName, file);
    }
    searchFiles(searchTerm) {
        return this.cloudService.searchItems(searchTerm);
    }
    getDriveStructure() {
        return this.cloudService.getDriveStructure();
    }
    deleteFile(folderPath, fileName) {
        return this.cloudService.deleteFile(folderPath);
    }
    deleteFolder(folderPath) {
        return this.cloudService.deleteFolder(folderPath);
    }
    downloadFile(folderPath) {
        return this.cloudService.downloadFile(folderPath);
    }
    downloadFolder(folderPath) {
        return this.cloudService.downloadFolder(folderPath);
    }
    rename(oldPath, newName) {
        this.cloudService.rename(oldPath, newName);
        return { message: 'Renamed successfully' };
    }
    createFile(folderPath, fileName, content) {
        return this.cloudService.createFile(folderPath, fileName, content);
    }
    getFile(filename, res) {
        const filePath = (0, path_1.join)('D:/c/Typescript/Compserv_MiniProjects/drive/drive', filename);
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(404).send('File not found');
            }
        });
    }
};
exports.CloudController = CloudController;
__decorate([
    (0, common_1.Post)('create-folder'),
    __param(0, (0, common_1.Body)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], CloudController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Get)('list-files/:folderPath'),
    __param(0, (0, common_1.Param)('folderPath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], CloudController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Get)('folders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], CloudController.prototype, "getAllFolders", null);
__decorate([
    (0, common_1.Post)('upload-file'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('folderName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", String)
], CloudController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('search-files'),
    __param(0, (0, common_1.Query)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], CloudController.prototype, "searchFiles", null);
__decorate([
    (0, common_1.Get)('drive-structure'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], CloudController.prototype, "getDriveStructure", null);
__decorate([
    (0, common_1.Delete)('delete-file'),
    __param(0, (0, common_1.Body)('folderPath')),
    __param(1, (0, common_1.Body)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", String)
], CloudController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Delete)('delete-folder'),
    __param(0, (0, common_1.Body)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], CloudController.prototype, "deleteFolder", null);
__decorate([
    (0, common_1.Get)('download-file'),
    __param(0, (0, common_1.Query)('folderPath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CloudController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Get)('download-folder'),
    __param(0, (0, common_1.Query)('folderPath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CloudController.prototype, "downloadFolder", null);
__decorate([
    (0, common_1.Patch)('rename'),
    __param(0, (0, common_1.Body)('oldPath')),
    __param(1, (0, common_1.Body)('newName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CloudController.prototype, "rename", null);
__decorate([
    (0, common_1.Post)('create-file'),
    __param(0, (0, common_1.Body)('folderPath')),
    __param(1, (0, common_1.Body)('fileName')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", String)
], CloudController.prototype, "createFile", null);
__decorate([
    (0, common_1.Get)(':filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CloudController.prototype, "getFile", null);
exports.CloudController = CloudController = __decorate([
    (0, common_1.Controller)('cloud'),
    __metadata("design:paramtypes", [cloud_service_1.CloudService])
], CloudController);
//# sourceMappingURL=cloud.controller.js.map