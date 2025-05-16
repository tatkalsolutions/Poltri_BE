import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import { __MSSQL_DB_USER, __MSSQL_DB_PASSWORD, __MSSQL_DB_SERVER, __MSSQL_DATABASE_MAIN } from 'src/config/config.config';


@Injectable()
export class ReportService {

  reportAssetsPath: string = '';
  async createReport(data: any): Promise<any> {
    let parameterString: string = "";
    let formulaString: string = "";
    if (data.parameters.length != 0) {
      for (let item of data.parameters) {
        parameterString += `-a "${item}" `;
      }
    }
    if (data.formulas.length != 0) {
      for (let item of data.formulas) {
        formulaString += ` -b "${item}"`
      }
    }


    const params = {
      fileName: data.fileName,
      parameters: parameterString,
      formulas: formulaString,
      session_id: data.session_id,
    };

    try {
      let data = await this.processRequest(params)
      console.log(data);           // Log or use the received data
      return data;
    } catch (error) {
      console.log(error)
      // Handle error as needed
      throw new Error('Failed to fetch the report');
    }
  }

  //------------ Create Pdf
  async processRequest(data: any): Promise<any> {
    this.reportAssetsPath = path.resolve(__dirname, '../assets/report/');
    const sessionCode = data.session_id;
    const outputDocx = `${sessionCode}.pdf`;
    const crexportCommand = `-F "${this.reportAssetsPath + '/rpt/' + data.fileName}" ` +
      `-U ${__MSSQL_DB_USER} ` +
      `-P ${__MSSQL_DB_PASSWORD || '""'} ` +
      `-S ${__MSSQL_DB_SERVER} ` +
      `-d "${__MSSQL_DATABASE_MAIN}" ` +
      `${data.parameters} ${data.formulas} ` +
      `-O "${this.reportAssetsPath + '/output/' + outputDocx}" ` +
      `-E pdf`;
    console.log(crexportCommand);


    const args = crexportCommand.match(/"([^"]+)"|[^ ]+/g).map((arg) => arg.replace(/^"|"$/g, ''));
    let filePath = path.resolve(this.reportAssetsPath, 'crexport.exe');
    console.log(filePath)
    await this.runProcess(`"${filePath}"`, args);

    return { filename: outputDocx };
  }

  private runProcess(command: string, args: string[]): Promise<void> {
    let forM = args.map(arg => `"${arg}"`);
    return new Promise((resolve, reject) => {
      const child = spawn(command, forM, { shell: true });
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
        } else {
          resolve();
        }
      });
    });
  }

  //------------ Create Pdf End

  //------------- Downalod PDF
  // http://192.168.1.234:8087/report/getReport?fileName=test.pdf 
  async getReport(fileName: any) {
    this.reportAssetsPath = path.resolve(__dirname, '../assets/report/');
    return await path.resolve(this.reportAssetsPath + "/output/", fileName);
  }
}
