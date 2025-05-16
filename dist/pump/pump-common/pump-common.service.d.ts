import { SQL } from 'src/database/sql.sql';
export declare class PumpCommonService {
    private config;
    constructor(config: SQL);
    branch_List(data: any): Promise<any>;
}
