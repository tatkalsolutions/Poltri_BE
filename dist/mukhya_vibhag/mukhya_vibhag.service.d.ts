import { SQL } from 'src/database/sql.sql';
export declare class MukhyaVibhagService {
    private readonly sql;
    constructor(sql: SQL);
    getSmartTableData(CompUnitID: any, MenuDocNo: any, FromDate: any, ToDate: any, UserID: any): Promise<any>;
    insMaterialStockOpeningBalance(data: any): Promise<void>;
    mukhyaVibhagInsert(dsHeader: any, dsFINAcPost: any, dsRefHeader: any, dsRefACPost: any): Promise<void>;
    getExistingTransactionData(data: any): Promise<any>;
    mukhyaVibhagTwoObj_Insert(dsHeader: any, dsACPost: any, dsRefHeader?: any, dsRefACPost?: any): Promise<void>;
    Sel_ApprovalTransactionsFinance(data: any): Promise<any>;
    kharchMagniVouchrInsert(dsHeader: any, dsACPost: any, dsRefHeader?: any, dsRefACPost?: any): Promise<void>;
}
