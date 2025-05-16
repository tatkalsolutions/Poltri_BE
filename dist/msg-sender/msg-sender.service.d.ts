import { HttpService } from '@nestjs/axios';
import { SQL } from 'src/database/sql.sql';
export declare class MsgSenderService {
    private sql;
    private httpService;
    private transporter;
    private readonly __fromMail;
    private readonly __fromMail_Password;
    constructor(sql: SQL, httpService: HttpService);
    sendMail(to: string, subject: string, text: string, htmlContent: string, attachments: Array<{
        filename: string;
        path: string;
    }>): Promise<void>;
}
