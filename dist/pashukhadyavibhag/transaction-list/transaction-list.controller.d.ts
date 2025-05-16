import { TransactionListService } from './transaction-list.service';
export declare class TransactionListController {
    private readonly transactionListService;
    constructor(transactionListService: TransactionListService);
    insRequisitionSlip(data: any): Promise<void>;
    insIssueAgslip(data: any): Promise<void>;
    insDirectIssue(data: any): Promise<void>;
    insBGRNDirect(data: any): Promise<void>;
}
