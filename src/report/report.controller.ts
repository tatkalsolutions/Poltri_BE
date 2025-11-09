import { Body, Controller, Get, NotFoundException, Post, Query, Res, StreamableFile } from '@nestjs/common';
import { ReportService } from './report.service';
import * as fs from 'fs';
import { Response } from 'express';
import * as  path from 'path';
import { Public } from 'src/auth/Public';

@Controller('report')
export class ReportController {


  constructor(
    private reportService: ReportService
  ) { }
  @Get()
  testReport() {
    return { message: "Test Get For Report" };
  }


  //-------------------- Reports Start
  @Post('/createReport')
  async createReport(@Body() data) {
    console.log(data)
    return await this.reportService.createReport(data);
  }

  //------ to download file 
  @Public()
  @Get('/getReport')
  async getReport(@Query('fileName') fileName: string, @Res() res: Response, @Query('download') download: boolean | string) {
    try {
      const filePath = await this.reportService.getReport(fileName);
      if (!fs.existsSync(filePath)) {
        // throw new NotFoundException(`File ${fileName} does not exist`);
        // Send HTML response when file not found
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(404).send(`
        <!doctype html>
        <html lang="mr">
        <head>
          <meta charset="utf-8">
          <title>अहवाल त्रुटी (Report errors)</title>
          <style>
            body { font-family: "Noto Sans Devanagari", sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; background:#f6f7fb; }
            .card { background:#fff; padding:24px 32px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.1); text-align:center; }
            .icon { font-size:48px; color:#ef4444; margin-bottom:10px; }
            h1 { font-size:20px; margin:10px 0; color:#111827; }
            p { color:#6b7280; margin:0; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">⚠️</div>
            <h1>अहवाल तयार करण्यात अयशस्वी</h1>
            <h1>Failed to generate report</h1>
            <p>कृपया पुन्हा प्रयत्न करा.</p>
            <p>Please try again.</p>
          </div>
        </body>
        </html>
      `);

      }

      const fileNameWithExtension = `${fileName}`;
      if (download == true || download == 'true') {
        // set headers to download pdf 
        res.setHeader('Content-Type', 'application/octet-stream');// ------- for auto downalod 
        res.setHeader('Content-Disposition', `attachment; filename="${fileNameWithExtension}"`);
      } else {
        // Set headers to display the PDF in the browser
        res.setHeader('Content-Type', 'application/pdf'); //------ for view in iframe
        res.setHeader('Content-Disposition', `inline; filename="${fileNameWithExtension}"`);
      }


      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res); // Pipe the file stream directly to the response

    } catch (error) {
      console.error('Error downloading file:', error.message);
      throw error;
    }
  }


  //-------------------- Reports Start End
}
