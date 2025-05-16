import { SQL } from 'src/database/sql.sql';
export declare class TransactionListService {
    private config;
    constructor(config: SQL);
    insRequisitionSlip(data: any): Promise<void>;
    insIssueAgslip(data: any): Promise<void>;
    insDirectIssue(data: any): Promise<void>;
    insBGRNDirect(data: any): Promise<void>;
}
