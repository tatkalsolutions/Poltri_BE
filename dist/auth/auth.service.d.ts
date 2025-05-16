import { SQL } from 'src/database/sql.sql';
export declare class AuthService {
    private config;
    private vector;
    private cryptoKey;
    constructor(config: SQL);
    findOne(username: any): Promise<any>;
    encrypt3DES(inputText: string): string;
    decrypt3DES(encryptedText: string): string;
}
