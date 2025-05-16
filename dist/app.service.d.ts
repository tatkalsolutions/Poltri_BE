import { SQL } from './database/sql.sql';
export declare class AppService {
    private sql;
    constructor(sql: SQL);
    companyDetails(): Promise<any>;
}
