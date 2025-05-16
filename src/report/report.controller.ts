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
  async getReport(@Query('fileName') fileName: string, @Res() res: Response) {
    try {
      const filePath = await this.reportService.getReport(fileName);
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException(`File ${fileName} does not exist`);
      }

      const fileNameWithExtension = `${fileName}`;
      // set headers to download pdf 
      // res.setHeader('Content-Type', 'application/octet-stream');// ------- for auto downalod 
      // res.setHeader('Content-Disposition', `attachment; filename="${fileNameWithExtension}"`);

      // Set headers to display the PDF in the browser
      res.setHeader('Content-Type', 'application/pdf'); //------ for view in iframe
      res.setHeader('Content-Disposition', `inline; filename="${fileNameWithExtension}"`);


      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res); // Pipe the file stream directly to the response

    } catch (error) {
      console.error('Error downloading file:', error.message);
      throw error;
    }
  }


  //-------------------- Reports Start End
}
