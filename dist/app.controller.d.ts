import { CommonService } from './common/common.service';
import { AppService } from './app.service';
export declare class AppController {
    private commonService;
    private appService;
    constructor(commonService: CommonService, appService: AppService);
    testGet(): {
        message: string;
    };
    menuDetails(data: any): Promise<any>;
    companyDetails(): Promise<any>;
}
