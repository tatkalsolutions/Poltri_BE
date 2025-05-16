"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const sql_sql_1 = require("../../database/sql.sql");
let DropdownService = class DropdownService {
    constructor(_service) {
        this._service = _service;
    }
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
                }
                else if (item.dateValue != undefined) {
                    let date = moment(item.dateValue, 'YYYYMMDD').format('DD/MM/YYYY');
                    let obj = { billDate: date, FROM_DATE: item.PSTART_DATE, TO_DATE: item.PEND_DATE };
                    dateList.push(obj);
                }
            }
        }
        if (dateList.length != 0) {
            return dateList;
        }
        else {
            return data;
        }
    }
};
exports.DropdownService = DropdownService;
exports.DropdownService = DropdownService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sql_sql_1.SQL])
], DropdownService);
//# sourceMappingURL=dropdown.service.js.map