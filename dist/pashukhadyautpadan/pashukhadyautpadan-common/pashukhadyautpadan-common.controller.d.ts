import { PashukhadyautpadanCommonService } from './pashukhadyautpadan-common.service';
export declare class PashukhadyautpadanCommonController {
    private readonly PashukhadyautpadanCommonService;
    constructor(PashukhadyautpadanCommonService: PashukhadyautpadanCommonService);
    transaction_list(data: any): Promise<any>;
    Get_ProdType(data: any): Promise<any>;
    Sel_ExistingTransactionsCFeedProd(data: any): Promise<any>;
}
