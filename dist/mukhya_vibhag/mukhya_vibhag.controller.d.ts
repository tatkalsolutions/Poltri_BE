import { MukhyaVibhagService } from './mukhya_vibhag.service';
export declare class MukhyaVibhagController {
    private readonly mukhyaVibhagService;
    constructor(mukhyaVibhagService: MukhyaVibhagService);
    getSmartTableData(data: any): Promise<any>;
    insMaterialStockOpeningBalance(data: any): Promise<void>;
    getInsertData(data: any): Promise<void>;
    getExistingTransactionData(data: any): Promise<any>;
    mukhyaVibhagTwoObj_Insert(data: any): Promise<void>;
    Sel_ApprovalTransactionsFinance(data: any): Promise<any>;
    kharchMagniVouchrInsert(data: any): Promise<void>;
}
