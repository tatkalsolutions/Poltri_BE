import { PashukhayavibhagcommonService } from './pashukhayavibhagcommon.service';
export declare class PashukhayavibhagcommonController {
    private readonly PashukhayavibhagcommonService;
    constructor(PashukhayavibhagcommonService: PashukhayavibhagcommonService);
    Sel_PendingRequ(data: any): Promise<any>;
    Sel_ExistingTransactionsFinance(data: any): Promise<any>;
}
