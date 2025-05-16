export declare class SQL {
    insertData(data: any): Promise<string>;
    insertUserData(data: any): Promise<any>;
    createObjectInsert(tableName: string, data: any): Promise<any>;
    createObjectInsertUser(tableName: string, data: any): Promise<any>;
    selectAll(data: any): Promise<any>;
    updateData(data: any, type?: 'main' | 'user'): Promise<string>;
    updateUserData(data: any): Promise<any>;
    getDatatableDataForClientSide(data: any): Promise<{
        data: any;
    }>;
    execSpWithParams(data: any, mult?: number): Promise<any>;
    execUserSpWithParams(data: any, mult?: number): Promise<any>;
    execOnlySp(data: any): Promise<any>;
    executeQuery(query: string, parameters?: any): Promise<any>;
    executeInsertQuery(queries: string[]): Promise<void>;
    executeQueryForMultTable(query: string, parameters?: any): Promise<any>;
    executeUserQuery(query: string, parameters?: any): Promise<any>;
    executeUserQueryForMultTable(query: string, parameters?: any): Promise<any>;
}
