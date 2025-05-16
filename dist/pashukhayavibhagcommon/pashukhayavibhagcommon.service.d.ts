import { SQL } from 'src/database/sql.sql';
export declare class PashukhayavibhagcommonService {
    private config;
    constructor(config: SQL);
    Sel_PendingRequ(data: any): Promise<any>;
    Sel_ExistingTransactionsFinance(data: any): Promise<any>;
}
