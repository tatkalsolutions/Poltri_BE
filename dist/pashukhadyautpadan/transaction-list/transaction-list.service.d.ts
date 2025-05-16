import { SQL } from 'src/database/sql.sql';
export declare class TransactionListService {
    private config;
    constructor(config: SQL);
    insAndStoreConsumption(data: any): Promise<void>;
    insGhatTut(data: any): Promise<void>;
}
