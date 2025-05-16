import { SQL } from 'src/database/sql.sql';
export declare class PashukhadyautpadanCommonService {
    private config;
    constructor(config: SQL);
    transactionList(data: any): Promise<any>;
    Get_ProdType(data: any): Promise<any>;
    Sel_ExistingTransactionsCFeedProd(data: any): Promise<any>;
}
