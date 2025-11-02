import { Injectable } from '@nestjs/common';
import { SQL } from 'src/database/sql.sql';
import { BOTRANACCTPOST } from './BOTranacctpost';
@Injectable()

export class ServicePurchaseTrans {
    constructor(private config: SQL, private tranacctpost: BOTRANACCTPOST) { }
    async PurchaseInsertGST(dsHeader, dsACPost, dsMatrialPost = [], dsOSDetail = [], dsMatrixPost = [], dsMatrialGRN = [], MSTMATVALRATE = []) {

        let queryArray = new Array();

        // let HeaderTableName = '';
        // let MaterialPostTable = '';
        // let AccountPostingTable = '';
        // let MaterialStockTable = '';
        // let MatrixPostingTable = '';
        // let GSTR1PostingTable = '';
        //Generate Tran No

        // dsHeader.STATUS_CODE = 0;

        if (dsHeader.TRAN_NO == 0 || dsHeader.TRAN_NO == undefined) {
            let TRANNO = await this.config.executeQuery(`Get_Next_Trans_No ${dsHeader.COMPUNIT_ID}, ${dsHeader.TRAN_TYPE}, ${dsHeader.TRAN_SUBTYPE}, ${dsHeader.TRAN_SERIES},${dsHeader.TRAN_DATE}, 'TRNACCTMATH'`)
            dsHeader['TRAN_NO'] = TRANNO[0][''];
            dsHeader['REF_TRANNO1'] = 0;
        } else {
            dsHeader['REF_TRANNO1'] = 0;
        }

        // GENERATE TRANFORMAT NO
        let TRANFORMAT = await this.config.executeQuery(`select dbo.FormatDocNo(${dsHeader.TRAN_NO})`);
        dsHeader['TRANFORMAT_NO'] = TRANFORMAT[0]['']


        if (dsHeader.TRAN_NO != 0) {
            // await this.config.executeQuery(`delete from TRNACCTMATH where TRAN_NO = ${dsHeader.TRAN_NO}`);
            queryArray.push(`delete from TRNACCTMATH where TRAN_NO = ${dsHeader.TRAN_NO}`);
            // await this.config.executeQuery(`delete from TRNACCTMATIPRCH where TRAN_NO = ${dsHeader.TRAN_NO}`);
            queryArray.push(`delete from TRNACCTMATIPRCH where TRAN_NO = ${dsHeader.TRAN_NO}`);
            // await this.config.executeQuery(`delete from TRNACCTMATITAX where TRAN_NO = ${dsHeader.TRAN_NO}`);
            queryArray.push(`delete from TRNACCTMATITAX where TRAN_NO = ${dsHeader.TRAN_NO}`);
            // await this.config.executeQuery(`delete from TRNACCTPOST where TRAN_NO = ${dsHeader.TRAN_NO}`);
            queryArray.push(`delete from TRNACCTPOST where TRAN_NO = ${dsHeader.TRAN_NO}`);
            // await this.config.executeQuery(`delete from TRNACCTMATIGSTR2 where TRAN_NO = ${dsHeader.TRAN_NO}`);
            queryArray.push(`delete from TRNACCTMATIGSTR2 where TRAN_NO = ${dsHeader.TRAN_NO}`);
            // await this.config.executeQuery(`delete from TRNACCTMATIRCM where TRAN_NO = ${dsHeader.TRAN_NO}`);
            queryArray.push(`delete from TRNACCTMATIRCM where TRAN_NO = ${dsHeader.TRAN_NO}`);
            // await this.config.executeQuery(`delete from TRNMATPOST where TRAN_NO = ${dsHeader.TRAN_NO}`);
            // queryArray.push(`delete from TRNMATPOST where TRAN_NO = ${dsHeader.TRAN_NO}`);
            // await this.config.executeQuery(`delete from TRNACCTMATIOUTSTAND where TRAN_NO = ${dsHeader.TRAN_NO}`);
            queryArray.push(`delete from TRNACCTMATIOUTSTAND where TRAN_NO = ${dsHeader.TRAN_NO}`);
            // await this.config.executeQuery(`delete from TRNACCTMATIPRCHGRN where TRAN_NO = ${dsHeader.TRAN_NO}`);
            queryArray.push(`delete from TRNACCTMATIPRCHGRN where TRAN_NO = ${dsHeader.TRAN_NO}`);
        }

        // GENERATE SYSTEM DATETIME
        let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
        dsHeader['SYSADD_DATETIME'] = sysDate[0]['']
        dsHeader['SYSCHNG_DATETIME'] = sysDate[0]['']
        dsHeader['SYSADD_LOGIN'] = 'ADMIN'
        dsHeader['tableName'] = 'TRNACCTMATH';

        //----------* MATHs Table entry are done
        let result = await this.config.insertData(dsHeader)
        queryArray.push(result);
        //---------* Material details table details
        if (dsMatrialPost.length != 0) {
            let SR_NO = 1;
            if (dsHeader.TRAN_SUBTYPE != 51) {
                for (let item of dsMatrialPost) {
                    item['TRAN_NO'] = dsHeader.TRAN_NO;
                    item['REF_TRANNO'] = dsHeader.REF_TRANNO;
                    item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                    item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                    item['GODOWN_CODE'] = dsHeader.GODOWN_CODE;
                    item['SUPP_SUB_GLACNO'] = dsHeader.SUB_GLACNO;
                    item['SYS_DATE'] = dsHeader.SYSADD_DATETIME;
                    item['USER_NAME'] = dsHeader.SYSADD_LOGIN;
                    item['SR_NO'] = SR_NO;
                    item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                    item['tableName'] = 'TRNACCTMATIPRCH';
                    let result = await this.config.insertData(item)
                    queryArray.push(result);
                    SR_NO++;
                }
            }
            if (dsHeader.TRAN_SUBTYPE == 52) {
                for (let item of MSTMATVALRATE) {
                    item['TRAN_NO'] = dsHeader.TRAN_NO;
                    item['GODOWN_CODE'] = dsHeader.GODOWN_CODE;
                    item['SYS_DATE'] = dsHeader.SYSADD_DATETIME;
                    item['USER_NAME'] = dsHeader.SYSADD_LOGIN;
                    item['SR_NO'] = SR_NO;
                    item['tableName'] = 'MSTMATVALRATE';
                    let result = await this.config.insertData(item)
                    queryArray.push(result);
                    SR_NO++;
                }
            }
        }



        let dataMatrix = dsMatrixPost;
        let FinalMatrixTable = new Array();
        for (let item of dataMatrix) {
            FinalMatrixTable.push(item);
            for (let ele of item.DATA) {
                FinalMatrixTable.push(ele);
            }
        }

        if (FinalMatrixTable.length != 0) {
            let SR_NO = 1;
            for (let item of FinalMatrixTable) {
                item['TRAN_NO'] = dsHeader.TRAN_NO;
                item['REF_PONO'] = dsHeader.REF_TRANNO;
                item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                item['tableName'] = 'TRNACCTMATITAX';
                item['SUB_GLACNO'] = item.SUB_GLACNO;
                item['SR_NO'] = SR_NO;
                item['REF_SRNO'] = SR_NO;
                item['CHAPTER_CODE'] = item.CHAPTER_CODE;
                item['MAT_CODE'] = item.MAT_CODE;
                item['POST_KEY'] = item.POST_KEY;
                item['RATE'] = item?.RATE;
                item['CHAPTER_NO'] = dsHeader.CHAPTER_NO;
                item['REF_SRNO'] = item?.REF_SR_NO;
                item['SYS_DATE'] = dsHeader.SYSADD_DATETIME;
                item['USER_NAME'] = dsHeader.SYSADD_LOGIN;
                // console.log(item);
                let result = await this.config.insertData(item)
                queryArray.push(result);
                SR_NO++;
            }
        }


        //------- Account Posting
        let MatrixAccountPostingArray = new Array();
        for (let item of FinalMatrixTable) {
            if (dsHeader.IS_INELIGIBLESUPPLIES == 1) {
                if (item.DRCR == 'C') {
                    let amount = item.AMOUNT * -1;
                    item.AMOUNT = amount;
                }
            } else {
                if (item.DRCR == 'C' && item.POST_KEY != 240) {
                    let amount = item.AMOUNT * -1;
                    item.AMOUNT = amount;
                }
            }

        }
        for (let item of FinalMatrixTable) {
            if (MatrixAccountPostingArray.length == 0) {
                let obj = {
                    GL_ACNO: item.GL_ACNO,
                    SUB_GLACNO: item.SUB_GLACNO,
                    DR_CR: item.DR_CR,
                    TRAN_AMOUNT: item.AMOUNT
                }
                MatrixAccountPostingArray.push(obj);
            } else {
                if (dsHeader.IS_INELIGIBLESUPPLIES != 1) {
                    if (item.POST_KEY != 240) {
                        let ele = MatrixAccountPostingArray.findIndex(x => x.GL_ACNO == item.GL_ACNO && x.SUB_GLACNO == item.SUB_GLACNO);
                        if (ele != -1) {
                            MatrixAccountPostingArray[ele].TRAN_AMOUNT = Number(MatrixAccountPostingArray[ele].TRAN_AMOUNT) + Number(item.AMOUNT);
                        } else {
                            let obj = {
                                GL_ACNO: item.GL_ACNO,
                                SUB_GLACNO: item.SUB_GLACNO,
                                DR_CR: item.DR_CR,
                                TRAN_AMOUNT: item.AMOUNT
                            }
                            MatrixAccountPostingArray.push(obj);
                        }
                    }
                } else {
                    let ele = MatrixAccountPostingArray.findIndex(x => x.GL_ACNO == item.GL_ACNO && x.SUB_GLACNO == item.SUB_GLACNO);
                    if (ele != -1) {
                        MatrixAccountPostingArray[ele].TRAN_AMOUNT = Number(MatrixAccountPostingArray[ele].TRAN_AMOUNT) + Number(item.AMOUNT);
                    } else {
                        let obj = {
                            GL_ACNO: item.GL_ACNO,
                            SUB_GLACNO: item.SUB_GLACNO,
                            DR_CR: item.DR_CR,
                            TRAN_AMOUNT: item.AMOUNT
                        }
                        MatrixAccountPostingArray.push(obj);
                    }
                }
            }
        }
        //---------* Account Posting
        let AccSrNO = 1;
        for (let item of dsACPost) {
            item['TRAN_NO'] = dsHeader.TRAN_NO;
            item['COMPUNIT_ID'] = dsHeader.COMPUNIT_ID;
            item['TRAN_DATE'] = dsHeader.TRAN_DATE;
            item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
            item['STATUS_CODE'] = dsHeader.STATUS_CODE;
            item['SYS_DATE'] = dsHeader.SYSADD_DATETIME;
            item['USER_NAME'] = dsHeader.SYSADD_LOGIN;
            item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
            item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
            item['SR_NO'] = AccSrNO;
            item['TRAN_AMT'] = item.TRAN_AMOUNT
            item['tableName'] = 'TRNACCTPOST';

            let result = await this.tranacctpost.insertTranAcctPost(item)
            queryArray.push(result);
            AccSrNO++
        }

        for (let item of MatrixAccountPostingArray) {
            if (item.TRAN_AMOUNT > 0) {
                item.DR_CR = 'D';
            } else {
                item.DR_CR = 'C';
                item.TRAN_AMOUNT = Math.abs(item.TRAN_AMOUNT);
            }
            item['TRAN_NO'] = dsHeader.TRAN_NO;
            item['TRAN_DATE'] = dsHeader.TRAN_DATE;
            item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
            item['STATUS_CODE'] = dsHeader.STATUS_CODE;
            item['SYS_DATE'] = dsHeader.SYSADD_DATETIME;
            item['USER_NAME'] = dsHeader.SYSADD_LOGIN;
            item['TRAN_AMT'] = item.TRAN_AMOUNT;
            item['SR_NO'] = AccSrNO;
            item['SHORT_NARATION'] = dsACPost[0].SHORT_NARATION;
            item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
            item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
            item['tableName'] = 'TRNACCTPOST';
            let result = await this.tranacctpost.insertTranAcctPost(item)
            queryArray.push(result);
            AccSrNO++
        }

        //---------* GSTR2 Posting
        var GSTR1MatrixDataSet = new Array();
        for (let item of FinalMatrixTable) {
            if (GSTR1MatrixDataSet.length == 0) {
                GSTR1MatrixDataSet.push(item);
            } else {
                if (item.POST_KEY < 240) {
                    let ele = GSTR1MatrixDataSet.findIndex(x => x.CHAPTER_CODE == item.CHAPTER_CODE && x.CHAPTER_NO == item.CHAPTER_NO && x.CGST_RATE == item.CGST_RATE && x.SGST_RATE == item.SGST_RATE && x.IGST_RATE == item.IGST_RATE && x?.TAX_CODE == item?.TAX_CODE);
                    if (ele != -1) {
                        GSTR1MatrixDataSet[ele].CGST_AMOUNT = Number(GSTR1MatrixDataSet[ele].CGST_AMOUNT) + Number(item.CGST_AMOUNT);
                        GSTR1MatrixDataSet[ele].SGST_AMOUNT = Number(GSTR1MatrixDataSet[ele].SGST_AMOUNT) + Number(item.SGST_AMOUNT);
                        GSTR1MatrixDataSet[ele].IGST_AMOUNT = Number(GSTR1MatrixDataSet[ele]?.IGST_AMOUNT) + Number(item?.IGST_AMOUNT);
                        GSTR1MatrixDataSet[ele].AMOUNT = Number(GSTR1MatrixDataSet[ele].AMOUNT) + Number(item.AMOUNT);
                    } else {
                        GSTR1MatrixDataSet.push(item);
                    }
                }
            }
        }
        console.log(GSTR1MatrixDataSet);

        if (dsHeader.IS_REVERSECHARGE == 0) {
            if (dsHeader.IS_GTA == 0) {
                if (GSTR1MatrixDataSet.length != 0) {
                    let GSTSRNO = 1;
                    for (let item of GSTR1MatrixDataSet) {
                        item['TRAN_NO'] = dsHeader.TRAN_NO;
                        item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                        item['TRAN_TYPE'] = dsHeader.TRAN_TYPE;
                        item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                        item['SUB_GLACNO'] = dsHeader?.GSTDOC_PARTY;
                        item['ASSESSED_VALUE'] = item.AMOUNT;
                        item['STATUS_CODE'] = '0';
                        item['ADD_RATE'] = item.CESS_RATE;
                        item['ADD_AMOUNT'] = item.CESS_AMOUNT;
                        item['DRCR'] = 'D';
                        item['VOUCHER_TYPE'] = dsHeader.VOUCHER_TYPE;
                        item['PARTY_STATE'] = dsHeader?.PARTY_STATE == undefined ? 0 : dsHeader?.PARTY_STATE;
                        item['PARTY_GSTINNO'] = dsHeader?.GSTDOC_GSTINNO == undefined ? '' : dsHeader?.GSTDOC_GSTINNO;
                        item['EXTREF_NO'] = dsHeader?.EXT_REF1 == undefined ? 0 : dsHeader?.EXT_REF1;
                        item['EXTREF_DATE'] = dsHeader?.EXT_REFDATE1 == undefined ? '' : dsHeader?.EXT_REFDATE1;
                        item['TRAN_AMT'] = dsHeader?.TRAN_AMT;
                        item['GSTREPORT_GROUPID'] = dsHeader?.GSTREPORT_GROUPID == undefined ? 0 : dsHeader?.GSTREPORT_GROUPID;
                        item['IS_GSTINREGISTERED'] = dsHeader?.IS_GSTINREGISTERED == undefined ? 0 : dsHeader?.IS_GSTINREGISTERED;
                        item['IS_COMPOSITEGSTIN'] = dsHeader?.IS_COMPOSITEGSTIN == undefined ? 0 : dsHeader?.IS_COMPOSITEGSTIN;
                        item['IS_REVERSECHARGE'] = dsHeader?.IS_REVERSECHARGE == undefined ? 0 : dsHeader?.IS_REVERSECHARGE;
                        item['IS_NONGSTSUPPLIES'] = dsHeader?.IS_NONGSTSUPPLIES == undefined ? 0 : dsHeader?.IS_NONGSTSUPPLIES;
                        item['SYS_DATE'] = dsHeader.SYSADD_DATETIME;
                        item['USER_NAME'] = dsHeader.SYSADD_LOGIN;
                        item['SYSADD_LOGIN'] = dsHeader.SYSADD_LOGIN;
                        item['SYSCHNG_LOGIN'] = dsHeader.SYSADD_LOGIN;
                        item['SR_NO'] = GSTSRNO;
                        item['tableName'] = 'TRNACCTMATIGSTR2';
                        item['IGST_AMOUNT'] = isNaN(item.IGST_AMOUNT) ? 0 : item.IGST_AMOUNT;
                        item['IGST_RATE'] = item?.IGST_RATE ? item.IGST_RATE : 0;

                        item['TAX_CODE'] = item.TAX_CODE;
                        item['CHAPTER_CODE'] = item.CHAPTER_CODE;
                        item['CHAPTER_NO'] = dsHeader.CHAPTER_NO;
                        item['ASSESSED_VALUE'] = item.AMOUNT;
                        item['CGST_RATE'] = item.CGST_RATE;
                        item['CGST_AMOUNT'] = item.CGST_AMOUNT;
                        item['SGST_RATE'] = item.SGST_RATE;
                        item['SGST_AMOUNT'] = item.SGST_AMOUNT;
                        item['IGST_RATE'] = item.IGST_RATE;
                        item['IGST_AMOUNT'] = item.IGST_AMOUNT;
                        item['ADD_RATE'] = item.CESS_RATE;
                        item['ADD_AMOUNT'] = item.CESS_AMOUNT;
                        item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                        let result = await this.config.insertData(item)
                        queryArray.push(result);

                        GSTSRNO++;
                    }
                }
            } else {
                var RCMMatrixData = new Array();
                for (let item of dsMatrialPost) {
                    if (RCMMatrixData.length == 0) {
                        RCMMatrixData.push(item);
                    } else {
                        if (item.POST_KEY < 240) {
                            let ele = RCMMatrixData.findIndex(x => x.RCMCGST_AMOUNT == item.RCMCGST_AMOUNT && x.RCMSGST_AMOUNT == item.RCMSGST_AMOUNT && x.RCMIGST_AMOUNT == item.RCMIGST_AMOUNT && x?.TAX_CODE == item?.TAX_CODE);
                            if (ele != -1) {
                                RCMMatrixData[ele].RCMCGST_AMOUNT = Number(RCMMatrixData[ele].RCMCGST_AMOUNT) + Number(item.RCMCGST_AMOUNT);
                                RCMMatrixData[ele].RCMSGST_AMOUNT = Number(RCMMatrixData[ele].RCMSGST_AMOUNT) + Number(item.RCMSGST_AMOUNT);
                                RCMMatrixData[ele].RCMIGST_AMOUNT = Number(RCMMatrixData[ele]?.RCMIGST_AMOUNT) + Number(item?.RCMIGST_AMOUNT);
                                RCMMatrixData[ele].AMOUNT = Number(RCMMatrixData[ele].AMOUNT) + Number(item.AMOUNT);
                            } else {
                                RCMMatrixData.push(item);
                            }
                        }
                    }
                }
                let RCMSRNO = 1;
                for (let item of RCMMatrixData) {
                    if (Number(item.RCMCGST_AMOUNT) + Number(item.RCMSGST_AMOUNT) + Number(item.RCMIGST_AMOUNT) != 0) {
                        let obj = {}
                        obj['TAX_CODE'] = item.TAX_CODE;
                        obj['ASSESSED_VALUE'] = item.AMOUNT;
                        obj['CGST_RATE'] = item.CGST_RATE;
                        obj['CGST_AMOUNT'] = item.RCMCGST_AMOUNT;
                        obj['SGST_RATE'] = item.SGST_RATE;
                        obj['SGST_AMOUNT'] = item.RCMSGST_AMOUNT;
                        obj['IGST_RATE'] = item.IGST_RATE;
                        obj['IGST_AMOUNT'] = item.RCMIGST_AMOUNT;
                        obj['DR_CR'] = 'D';
                        obj['TRAN_NO'] = dsHeader.TRAN_NO;
                        obj['TRAN_DATE'] = dsHeader.TRAN_DATE;
                        obj['TRAN_TYPE'] = dsHeader.TRAN_TYPE;
                        obj['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                        obj['SUB_GLACNO'] = dsHeader.GSTDOC_PARTY;
                        // obj['PARTY_NAME'] = dsHeader.
                        obj['EXTREF_NO'] = dsHeader?.EXT_REF1 == undefined ? 0 : dsHeader?.EXT_REF1;
                        obj['EXTREF_DATE'] = dsHeader?.EXT_REFDATE1 == undefined ? '' : dsHeader?.EXT_REFDATE1;
                        obj['EXTREF_NO'] = dsHeader.EXT_REF1;
                        obj['PARTY_STATE'] = dsHeader.PARTY_STATE;
                        obj['GSTREPORT_GROUPID'] = 0;
                        obj['IS_INELIGIBLESUPPLIES'] = dsHeader.IS_INELIGIBLESUPPLIES;
                        obj['IS_GTA'] = dsHeader.IS_GTA;
                        obj['STATUS_CODE'] = dsHeader.STATUS_CODE;
                        obj['tableName'] = 'TRNACCTMATIRCM'
                        obj['SR_NO'] = RCMSRNO;

                        let result = await this.config.insertData(obj)
                        queryArray.push(result);
                        RCMSRNO++;
                    }
                }
            }
        }


        // //---------* Material Posting for Stock Calculation
        // if (dsMatrialPost.length != 0) {
        //     let stockPostSrNO = 1;
        //     if (dsHeader.TRAN_SUBTYPE != 56 && dsHeader.TRAN_SUBTYPE != 52 && dsHeader.TRAN_SUBTYPE != 51) {
        //         for (let item of dsMatrialPost) {
        //             if (item.STOCKQTY != 0) {
        //                 let objMatPost = new Object();
        //                 objMatPost['TRAN_NO'] = dsHeader.TRAN_NO;
        //                 objMatPost['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
        //                 objMatPost['TRAN_TYPE'] = dsHeader.TRAN_TYPE;
        //                 objMatPost['REF_TRANNO'] = dsHeader.TRAN_NO;
        //                 objMatPost['TRAN_DATE'] = dsHeader.TRAN_DATE;
        //                 objMatPost['COMPUNIT_ID'] = dsHeader.COMPUNIT_ID;
        //                 objMatPost['GODOWN_CODE'] = dsHeader.GODOWN_CODE;
        //                 objMatPost['MAT_CODE'] = item.MAT_CODE;
        //                 objMatPost['BRAND_CODE'] = item.BRAND_CODE;
        //                 objMatPost['UNIT_CODE'] = item.UNIT_CODE;
        //                 objMatPost['QTY'] = item.QTY;
        //                 objMatPost['MAT_RATE'] = item.RATE;
        //                 objMatPost['RATE_PER'] = item.RATE_PER;
        //                 objMatPost['MAT_VALUE'] = item.AMOUNT;
        //                 objMatPost['GL_ACNO'] = dsHeader.GL_ACNO;
        //                 objMatPost['SUB_GLACNO'] = dsHeader.SUB_GLACNO;
        //                 objMatPost['STATUS_CODE'] = dsHeader.STATUS_CODE;
        //                 objMatPost['SR_NO'] = stockPostSrNO;
        //                 objMatPost['SYS_DATE'] = dsHeader.SYSADD_DATETIME;
        //                 objMatPost['USER_NAME'] = dsHeader.SYSADD_LOGIN;
        //                 objMatPost['tableName'] = 'TRNMATPOST';
        //                 let result = await this.config.insertData(objMatPost)
        //                 queryArray.push(result)
        //                 stockPostSrNO++;
        //             }
        //         }
        //     }
        // }

        //-----------* Material OutStanding Posting
        if (dsOSDetail.length != 0) {
            let SRNO = 1
            for (let item of dsOSDetail) {
                item['TRAN_NO'] = dsHeader.TRAN_NO;
                item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                item['TRAN_TYPE'] = dsHeader.TRAN_TYPE;
                item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                item['REF_TRANNO'] = dsHeader.TRAN_NO;
                item['REF_TRANSUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                item['REF_TRANDATE'] = dsHeader.TRAN_DATE;
                item['EXT_REFDATE'] = dsHeader?.EXT_REFDATE1;
                item['DUE_DATE'] = dsHeader.DUE_DATE;
                item['REPORT_TYPE'] = '01'
                item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                item['SR_NO'] = SRNO
                item['REF_SRNO'] = SRNO
                item['tableName'] = 'TRNACCTMATIOUTSTAND';
                let result = await this.config.insertData(item)
                queryArray.push(result);
                SRNO++;
            }
        }

        //-------------* Material GRN Posting
        if (dsMatrialGRN.length != 0) {
            let SRNO = 1;
            for (let item of dsMatrialGRN) {
                item['TRAN_NO'] = dsHeader.TRAN_NO;
                item['TRAN_DATE'] = dsHeader.TRAN_DATE;
                item['TRAN_TYPE'] = dsHeader.TRAN_TYPE;
                item['TRAN_SUBTYPE'] = dsHeader.TRAN_SUBTYPE;
                item['REF_PONO'] = dsHeader.REF_TRANNO;
                item['REF_AMENDNO'] = dsHeader.REF_AMENDNO
                item['STATUS_CODE'] = dsHeader.STATUS_CODE;
                item['SYSADD_LOGIN'] = 'ADMIN'
                item['SYSCHNG_LOGIN'] = 'ADMIN'
                item['SR_NO'] = SRNO
                item['tableName'] = 'TRNACCTMATIPRCHGRN';

                let result = await this.config.insertData(item)
                queryArray.push(result);
                SRNO++;
            }
        }

        await this.config.executeInsertQuery(queryArray);


        return { 'TRAN_NO': dsHeader['TRAN_NO'] }
    }
}