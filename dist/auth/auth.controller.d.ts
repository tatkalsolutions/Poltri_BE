import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SQL } from 'src/database/sql.sql';
import { CommonService } from 'src/common/common.service';
export declare class AuthController {
    private readonly authService;
    private jwtService;
    private sql;
    private commonService;
    constructor(authService: AuthService, jwtService: JwtService, sql: SQL, commonService: CommonService);
    signIn(data: any): Promise<{
        STATUS_CODE: string;
        MESSAGE: string;
        MODULES?: undefined;
        access_token?: undefined;
        userInfo?: undefined;
    } | {
        MODULES: any;
        access_token: string;
        userInfo: any;
        STATUS_CODE: string;
        MESSAGE?: undefined;
    }>;
}
