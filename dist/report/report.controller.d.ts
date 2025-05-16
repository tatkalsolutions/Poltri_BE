import { ReportService } from './report.service';
import { Response } from 'express';
export declare class ReportController {
    private reportService;
    constructor(reportService: ReportService);
    testReport(): {
        message: string;
    };
    createReport(data: any): Promise<any>;
    getReport(fileName: string, res: Response): Promise<void>;
}
