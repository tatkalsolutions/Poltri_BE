import { StreamableFile } from '@nestjs/common';
export declare class CloudService {
    private readonly baseDir;
    constructor();
    createFolder(folderPath: string): string;
    createFile(folderPath: string, fileName: string, content: string): string;
    listFiles(folderPath: string): string[];
    getAllFolders(): string[];
    uploadFile(folderName: string, file: Express.Multer.File): string;
    private getAllItems;
    private calculateFolderSize;
    searchItems(searchTerm: string): any[];
    private getAllFiles;
    getDriveStructure(): any;
    private buildStructure;
    deleteFile(folderPath: string): string;
    deleteFolder(folderPath: string): string;
    downloadFile(folderPath: string): StreamableFile;
    downloadFolder(folderPath: string): Promise<StreamableFile>;
    rename(oldPath: string, newName: string): void;
}
