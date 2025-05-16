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
exports.CloudService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const config_config_1 = require("../config/config.config");
let CloudService = class CloudService {
    constructor() {
        this.baseDir = path.join(__dirname, config_config_1.__CLOUD_PATH);
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
    }
    createFolder(folderPath) {
        if (!folderPath) {
            throw new common_1.BadRequestException('Folder path must be provided.');
        }
        const fullPath = path.join(this.baseDir, folderPath);
        if (fs.existsSync(fullPath)) {
            throw new common_1.BadRequestException(`Folder '${folderPath}' already exists.`);
        }
        fs.mkdirSync(fullPath, { recursive: true });
        return `Folder '${folderPath}' created successfully.`;
    }
    createFile(folderPath, fileName, content) {
        const fullFolderPath = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(fullFolderPath)) {
            throw new common_1.BadRequestException(`Folder '${folderPath}' does not exist in the drive.`);
        }
        const filePath = path.join(fullFolderPath, fileName);
        fs.writeFileSync(filePath, content);
        return `File '${fileName}' created in folder '${folderPath}' successfully.`;
    }
    listFiles(folderPath) {
        const fullFolderPath = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(fullFolderPath)) {
            throw new common_1.BadRequestException(`Folder '${folderPath}' does not exist.`);
        }
        return fs.readdirSync(fullFolderPath).filter(file => {
            return fs.statSync(path.join(fullFolderPath, file)).isFile();
        });
    }
    getAllFolders() {
        const folders = fs.readdirSync(this.baseDir).filter(file => fs.statSync(path.join(this.baseDir, file)).isDirectory());
        return folders;
    }
    uploadFile(folderName, file) {
        if (!folderName) {
            throw new common_1.BadRequestException('Folder name must be provided.');
        }
        if (!file) {
            throw new common_1.BadRequestException('File must be provided.');
        }
        const folderPath = path.join(this.baseDir, folderName);
        if (!fs.existsSync(folderPath)) {
            throw new common_1.BadRequestException(`Folder '${folderName}' does not exist.`);
        }
        const filePath = path.join(folderPath, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        return `File '${file.originalname}' uploaded successfully to folder '${folderName}'.`;
    }
    getAllItems(dirPath) {
        const items = fs.readdirSync(dirPath);
        let results = [];
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                results.push({
                    name: item,
                    path: itemPath,
                    type: 'folder',
                    size: this.calculateFolderSize(itemPath),
                    lastModified: stats.mtime,
                });
                results = results.concat(this.getAllItems(itemPath));
            }
            else {
                results.push({
                    name: item,
                    path: itemPath,
                    type: 'file',
                    size: stats.size,
                    lastModified: stats.mtime,
                });
            }
        });
        return results;
    }
    calculateFolderSize(dirPath) {
        let totalSize = 0;
        const items = fs.readdirSync(dirPath);
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                totalSize += this.calculateFolderSize(itemPath);
            }
            else {
                totalSize += stats.size;
            }
        });
        return totalSize;
    }
    searchItems(searchTerm) {
        const allItems = this.getAllItems(this.baseDir);
        return allItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    getAllFiles(dirPath, filesArray = []) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                this.getAllFiles(filePath, filesArray);
            }
            else {
                filesArray.push(filePath.replace(this.baseDir + path.sep, ''));
            }
        });
        return filesArray;
    }
    getDriveStructure() {
        return this.buildStructure(this.baseDir);
    }
    buildStructure(dirPath) {
        const items = fs.readdirSync(dirPath);
        const structure = [];
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                structure.push({
                    name: item,
                    type: 'folder',
                    size: this.calculateFolderSize(itemPath),
                    lastModified: stats.mtime,
                    subfolder: this.buildStructure(itemPath),
                });
            }
            else {
                structure.push({
                    name: item,
                    type: 'file',
                    size: stats.size,
                    lastModified: stats.mtime,
                });
            }
        });
        return structure;
    }
    deleteFile(folderPath) {
        if (!folderPath) {
            throw new common_1.BadRequestException('Folder name and file name must be provided.');
        }
        const filePath = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException(`File  does not exist in folder '${folderPath}'.`);
        }
        fs.unlinkSync(filePath);
        return `File  deleted successfully from folder '${folderPath}'.`;
    }
    deleteFolder(folderPath) {
        if (!folderPath) {
            throw new common_1.BadRequestException('Folder name must be provided.');
        }
        const folderToDelete = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(folderToDelete)) {
            throw new common_1.NotFoundException(`Folder '${folderPath}' does not exist.`);
        }
        fs.rmSync(folderToDelete, { recursive: true, force: true });
        return `Folder '${folderPath}' and its contents deleted successfully.`;
    }
    downloadFile(folderPath) {
        if (!folderPath) {
            throw new common_1.BadRequestException('Folder name and file name must be provided.');
        }
        const filePath = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException(`File  does not exist in folder '${folderPath}'.`);
        }
        const file = fs.createReadStream(filePath);
        return new common_1.StreamableFile(file);
    }
    async downloadFolder(folderPath) {
        if (!folderPath) {
            throw new common_1.BadRequestException('Folder name must be provided.');
        }
        const folderToZip = path.join(this.baseDir, folderPath);
        if (!fs.existsSync(folderToZip)) {
            throw new common_1.NotFoundException(`Folder '${folderPath}' does not exist.`);
        }
        const zipFileName = `${folderPath.replace(/\//g, '_')}.zip`;
        const zipFilePath = path.join(this.baseDir, zipFileName);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip');
        return new Promise((resolve, reject) => {
            archive.pipe(output);
            archive.directory(folderToZip, false);
            archive.finalize();
            output.on('close', () => {
                const zipFileStream = fs.createReadStream(zipFilePath);
                resolve(new common_1.StreamableFile(zipFileStream));
            });
            archive.on('error', (err) => {
                reject(err);
            });
        });
    }
    rename(oldPath, newName) {
        const fullOldPath = path.join(this.baseDir, oldPath);
        const fullNewPath = path.join(this.baseDir, path.dirname(oldPath), newName);
        if (!fs.existsSync(fullOldPath)) {
            throw new common_1.NotFoundException('File or folder does not exist');
        }
        fs.renameSync(fullOldPath, fullNewPath);
    }
};
exports.CloudService = CloudService;
exports.CloudService = CloudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudService);
//# sourceMappingURL=cloud.service.js.map