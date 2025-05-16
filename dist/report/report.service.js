"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const path = require("path");
const config_config_1 = require("../config/config.config");
let ReportService = class ReportService {
    constructor() {
        this.reportAssetsPath = '';
    }
    async createReport(data) {
        let parameterString = "";
        let formulaString = "";
        if (data.parameters.length != 0) {
            for (let item of data.parameters) {
                parameterString += `-a "${item}" `;
            }
        }
        if (data.formulas.length != 0) {
            for (let item of data.formulas) {
                formulaString += ` -b "${item}"`;
            }
        }
        const params = {
            fileName: data.fileName,
            parameters: parameterString,
            formulas: formulaString,
            session_id: data.session_id,
        };
        try {
            let data = await this.processRequest(params);
            console.log(data);
            return data;
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to fetch the report');
        }
    }
    async processRequest(data) {
        this.reportAssetsPath = path.resolve(__dirname, '../assets/report/');
        const sessionCode = data.session_id;
        const outputDocx = `${sessionCode}.pdf`;
        const crexportCommand = `-F "${this.reportAssetsPath + '/rpt/' + data.fileName}" ` +
            `-U ${config_config_1.__MSSQL_DB_USER} ` +
            `-P ${config_config_1.__MSSQL_DB_PASSWORD || '""'} ` +
            `-S ${config_config_1.__MSSQL_DB_SERVER} ` +
            `-d "${config_config_1.__MSSQL_DATABASE_MAIN}" ` +
            `${data.parameters} ${data.formulas} ` +
            `-O "${this.reportAssetsPath + '/output/' + outputDocx}" ` +
            `-E pdf`;
        console.log(crexportCommand);
        const args = crexportCommand.match(/"([^"]+)"|[^ ]+/g).map((arg) => arg.replace(/^"|"$/g, ''));
        let filePath = path.resolve(this.reportAssetsPath, 'crexport.exe');
        console.log(filePath);
        await this.runProcess(`"${filePath}"`, args);
        return { filename: outputDocx };
    }
    runProcess(command, args) {
        let forM = args.map(arg => `"${arg}"`);
        return new Promise((resolve, reject) => {
            const child = (0, child_process_1.spawn)(command, forM, { shell: true });
            child.stdout.on('data', (data) => {
                console.log(`${command} stdout: ${data}`);
            });
            child.stderr.on('data', (data) => {
                console.error(`${command} stderr: ${data}`);
            });
            child.on('error', (err) => {
                console.error(`Failed to start ${command} process:`, err);
                reject(err);
            });
            child.on('close', (code) => {
                console.log(`${command} process exited with code ${code}`);
                if (code !== 0) {
                    reject(new Error(`${command} process failed with exit code ${code}`));
                }
                else {
                    resolve();
                }
            });
        });
    }
    async getReport(fileName) {
        this.reportAssetsPath = path.resolve(__dirname, '../assets/report/');
        return await path.resolve(this.reportAssetsPath + "/output/", fileName);
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)()
], ReportService);
//# sourceMappingURL=report.service.js.map