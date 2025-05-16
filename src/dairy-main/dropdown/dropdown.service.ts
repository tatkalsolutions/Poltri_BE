import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class DropdownService {
  constructor(private _service: SQL,) { }

  async billDateSP(data) {
    var data = await this._service.executeQuery(`exec Get_Posting_Dates @COMPANY_ID=N'101',@display_code=${data.dateCode},@days=${data.type}`);
    return data;
  }

  async billDate(data) {
    var dateList = new Array();
    var data = await this._service.executeQuery(`Get_Posting_Dates '101', '${data.display_code}', '${data.type}'`);
    if (data.length != 0) {
      for (let item of data) {
        if (item.BILL_DATE != undefined) {
          let date = moment(item.BILL_DATE, 'YYYYMMDD').format('DD/MM/YYYY');
          let obj = { billDate: date, FROM_DATE: item.FROM_DATE, TO_DATE: item.TO_DATE };
          dateList.push(obj);
        } else if (item.dateValue != undefined) {
          let date = moment(item.dateValue, 'YYYYMMDD').format('DD/MM/YYYY');
          let obj = { billDate: date, FROM_DATE: item.PSTART_DATE, TO_DATE: item.PEND_DATE };
          dateList.push(obj);
        }
      }
    }
    if (dateList.length != 0) {
      return dateList;
    } else {
      return data;
    }
  }
}
