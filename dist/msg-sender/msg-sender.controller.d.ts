import { MsgSenderService } from './msg-sender.service';
export declare class MsgSenderController {
    private readonly msgSenderService;
    constructor(msgSenderService: MsgSenderService);
    sendMail(to: string, subject: string, text: string, htmlContent: string, attachments: Array<{
        filename: string;
        path: string;
    }>): Promise<{
        message: string;
    }>;
    uploadFile(file: Express.Multer.File): {
        message: string;
        file: Express.Multer.File;
    };
}
