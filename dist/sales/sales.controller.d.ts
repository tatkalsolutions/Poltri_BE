import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    mainSalesInsert(data: any): Promise<{
        TRAN_NO: any;
    }>;
}
