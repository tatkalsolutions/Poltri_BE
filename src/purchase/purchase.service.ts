import { Injectable } from '@nestjs/common';
import { ServicePurchaseTrans } from 'src/BOTrans/BOServicePurchaseTrans';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class PurchaseService {
  constructor(private servicePurchase: ServicePurchaseTrans, private config: SQL) { }
  async servicepurchaseInsert(data) {
    return await this.servicePurchase.PurchaseInsertGST(data.TRNACCTMATH, data.TRNACCTPOST, data.TRNACCTMATIPRCH, data.TRNACCTMATIOUTSTAND, data.TRNACCTMATITAX, data?.TRNACCTMATIPRCHGRN, data?.MSTMATVALRATE)
  }

  async getGLAccountList() {
    return await this.config.executeQuery(`select AC_NO CODE, ISNULL(AC_NAME,'')+(CASE SUB_GLCODE WHEN 11 THEN ' - Customer Milk' WHEN 12 THEN ' - Supplier' WHEN 14 THEN ' - Assets' WHEN 15 THEN ' - Personal' WHEN 17 THEN ' - Sanstha' WHEN 18 THEN ' - Milk Dealer' WHEN 20 THEN ' - Transporters' WHEN 21 THEN ' - Other Customer' Else '' END) AS NAME,UPPER(CASE WHEN SUB_GLCODE=17 THEN CONVERT(VARCHAR,CONVERT(INT,Right(SUB_GLACNO,4))) + SPACE(1)+ ISNULL(AC_NAME,'') ELSE ISNULL(AC_NAME,'') END) AS SUBGL_LONGNAME, AC_NO, AC_NAME, (CONVERT(VARCHAR(20),GL_ACNO) + '|' + CONVERT(VARCHAR(20),SUB_GLACNO) + '|') AS GLSUBGL_ACNO, GL_ACNO, SUB_GLACNO, 0 AMOUNT from MSTACCTGLSUBGLVW where SUBGL_EXIST=0 AND SUB_GLCODE IN(0,14) AND STATUS_CODE=0 order by AC_NAME`)
  }
  async getHSNSACList() {
    return await this.config.executeQuery(`select CONVERT(VARCHAR(10),CODE) + '|' + CONVERT(VARCHAR(10),ISNULL(GST_RATECATEGORY,0)) CODE, CASE WHEN ISNULL(CHAPTER_NO,'') ='' THEN ISNULL(NAME,'') ELSE CHAPTER_NO + ' ' + NAME END NAME, CODE AS CHAPTER_CODE, CHAPTER_NO, GST_RATECATEGORY, GST_CATEGORYNAME from CNFHSNSACMAST where STATUS_CODE = 0`)
  }
  async dsExistingPurchaseData(data) {
    let object = {
      name: 'Sel_ExistingTransactionsPurchaseGST',
      params: [data.TRAN_NO, data.TRAN_SUBTYPE, 0]
    }
    return await this.config.execSpWithParams(object, 1);
  }

}
