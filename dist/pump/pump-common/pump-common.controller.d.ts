import { PumpCommonService } from './pump-common.service';
export declare class PumpCommonController {
    private readonly PumpCommonService;
    constructor(PumpCommonService: PumpCommonService);
    branch_List(data: any): Promise<any>;
}
