export declare class ReportService {
    reportAssetsPath: string;
    createReport(data: any): Promise<any>;
    processRequest(data: any): Promise<any>;
    private runProcess;
    getReport(fileName: any): Promise<string>;
}
