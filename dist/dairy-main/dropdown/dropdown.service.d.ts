import { SQL } from 'src/database/sql.sql';
export declare class DropdownService {
    private _service;
    constructor(_service: SQL);
    billDateSP(data: any): Promise<any>;
    billDate(data: any): Promise<any>;
}
