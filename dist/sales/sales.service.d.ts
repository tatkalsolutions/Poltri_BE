import { SQL } from 'src/database/sql.sql';
export declare class SalesService {
    private config;
    constructor(config: SQL);
    mainSalesInsert(data: any): Promise<{
        TRAN_NO: any;
    }>;
}
