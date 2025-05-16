import { Response } from 'express';
import { CloudService } from './cloud.service';
export declare class CloudController {
    private readonly cloudService;
    constructor(cloudService: CloudService);
    createFolder(folderPath: string): string;
    listFiles(folderPath: string): string[];
    getAllFolders(): string[];
    uploadFile(file: Express.Multer.File, folderName: string): string;
    searchFiles(searchTerm: string): string[];
    getDriveStructure(): any;
    deleteFile(folderPath: string, fileName: string): string;
    deleteFolder(folderPath: string): string;
    downloadFile(folderPath: string): import("@nestjs/common").StreamableFile;
    downloadFolder(folderPath: string): Promise<import("@nestjs/common").StreamableFile>;
    rename(oldPath: string, newName: string): {
        message: string;
    };
    createFile(folderPath: string, fileName: string, content: string): string;
    getFile(filename: string, res: Response): void;
}
