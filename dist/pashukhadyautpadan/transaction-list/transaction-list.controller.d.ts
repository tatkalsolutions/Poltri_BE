import { TransactionListService } from './transaction-list.service';
export declare class TransactionListController {
    private readonly transactionListService;
    constructor(transactionListService: TransactionListService);
    insAndStoreConsumption(data: any): Promise<void>;
    insGhatTut(data: any): Promise<void>;
}
