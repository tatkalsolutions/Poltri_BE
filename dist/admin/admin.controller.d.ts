import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly service;
    constructor(service: AdminService);
    newRole(data: any): Promise<any>;
    getRole(data: any): Promise<any>;
    newUser(data: any): Promise<any>;
    getUser(data: any): Promise<any>;
    changePassword(body: any): Promise<{
        status_code: number;
        message: string;
    }>;
    updateAssignUserWiseRoles(data: any): Promise<void>;
    getAssignMenuAccessRole(body: any): Promise<any>;
    getEmpDrp(body: any): Promise<any>;
    resetPassword(body: any): Promise<any>;
    enableDisableUser(body: any): Promise<any>;
    getBusinessInfo(data: any): Promise<void>;
    getMenusModuleWise(body: any): Promise<any>;
    updateMenusModuleWise(body: any): Promise<void>;
    db_BackupPath(isLocal?: boolean): Promise<any>;
    db_Backup(): Promise<{
        status: boolean;
    }>;
    checkUSER_ID(body: any): Promise<any>;
    insertUserRoles(body: any): Promise<void>;
    insertCallType(body: any): Promise<void>;
    updateCNFCOMPANY(body: any): Promise<void>;
}
