import { AuthService } from 'src/auth/auth.service';
import { SQL } from 'src/database/sql.sql';
export declare class AdminService {
    private config;
    private authService;
    constructor(config: SQL, authService: AuthService);
    getRole(data: any): Promise<any>;
    newRole(data: any): Promise<any>;
    getUser(data: any): Promise<any>;
    getNewUser(data: any): Promise<any>;
    getUserSpdata(data: any): Promise<any>;
    getAssignMenuAccessRole(data: any): Promise<any>;
    hash(password: string): Promise<string>;
    changePassword(data: any): Promise<{
        status_code: number;
        message: string;
    }>;
    updateAssignUserWiseRoles(data: any): Promise<void>;
    getEmpDrp(): Promise<any>;
    resetPassword(data: any): Promise<any>;
    enableDisableUser(data: any): Promise<any>;
    updateBusinessInformation(data: any): Promise<void>;
    getMenusModuleWise(body: any): Promise<any>;
    updateMenusModuleWise(data: any): Promise<void>;
    db_Backup(path: {
        DATABASE_BACKUP_PATH: string;
        MAIN_DATABASE: string;
        MAIN_DATABASE_BACKUP_PATH: string;
        USER_DATABASE: string;
        USER_DATABASE_BACKUP_PATH: string;
    }): Promise<{
        status: boolean;
    }>;
    checkUSER_ID(body: any): Promise<any>;
    insertUserRoles(data: any): Promise<void>;
    insertCallType(body: any): Promise<void>;
    updateCNFCOMPANY(data: any): Promise<void>;
}
