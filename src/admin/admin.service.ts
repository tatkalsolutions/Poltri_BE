import { BadRequestException, Body, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as moment from "moment";
import { AuthService } from 'src/auth/auth.service';
import { __MSSQL_DATABASE_MAIN, __MSSQL_DATABASE_USER } from 'src/config/config.config';
import { SQL } from 'src/database/sql.sql';

@Injectable()
export class AdminService {

  constructor(
    private config: SQL,
    private authService: AuthService
  ) {

  }
  async getRole(data: any) {
    return await this.config.executeUserQuery(`SELECT * FROM ROLES WHERE CODE = ${data.CODE}`)
  }

  async newRole(data: any) {

    if (data.CODE == undefined) {
      //inser
      let code: any = "select top 1 CODE from Roles order by CODE desc"

      code = await this.config.executeUserQuery(code);
      code = code[0].CODE + 1

      data["CODE"] = code;
      data["tableName"] = "Roles"
      return await this.config.insertUserData(data);
    } else {
      //update

      let code = data.CODE;
      await this.config.executeUserQuery(`DELETE FROM Roles WHERE CODE = ${code}`);
      data["CODE"] = code;
      data["tableName"] = "Roles"

      return await this.config.insertUserData(data);
    }
  }

  async getUser(data) {
    return await this.config.executeUserQuery(`SELECT * FROM USERS WHERE USER_ID = '${data.USER_ID}'`);
  }

  async getNewUser(data) {
    data = data.data
    let sysDate = await this.config.executeUserQuery(`Get_SYSDATETIME`);
    let dsExistingData: any = [];

    if (data['USER_ID']) {
      dsExistingData = await this.config.executeUserQuery(`SELECT * FROM USERS WHERE USER_ID = '${data['USER_ID']}'`);

      await this.config.executeUserQuery(`DELETE FROM USERS WHERE USER_ID = '${data['USER_ID']}'`);
    }
    data['COMPANY_ID'] = data.COMPANY_ID;
    data['USER_ID'] = data.USER_ID;
    data['NAME'] = data.USER_NAME;

    if (data['PASSWORD']) {
      // data['PASSWORD'] = await this.hash(data.PASSWORD)
      data['PASSWORD'] = await this.authService.encrypt3DES(data.PASSWORD)
    } else {
      // data['PASSWORD'] = dsExistingData[0]["PASSWORD"]
    }
    data['DEPARTMENT'] = null
    data['DESG_CODE'] = null
    data['CELL_NO'] = null
    data['EMAIL_ID'] = null
    data['MODULE_NO'] = 99
    data['EMP_CODE'] = data.EMP_CODE
    data['CREATED_DATE'] = sysDate[0][''].slice(0, 8)
    data['VALID_TILL_DATE'] = 0
    data['STATUS_CODE'] = 0
    data["tableName"] = "Users"
    return await this.config.insertUserData(data);
  }

  async getUserSpdata(data) {
    let object = {
      name: data.name,
      params: data.params
    }
    return await this.config.execUserSpWithParams(object, data.multiflag);

  }

  async getAssignMenuAccessRole(data) {
    // let obj = {
    //   name: "Get_HelpList",
    //   params: `@chrCOMPANYID='101',@chrTableName='MODULES',@chrCompanyidColumn='COMPANY_ID',@chrHelpColumnNames='*',@chrHelpColumnFilter='STATUS_CODE=0',@chrSortOrder='',@intExecFlag=1`
    // };

    let obj2 = {
      name: "Sel_RoleAccess",
      params: `@chrOption=N'1',@chrCompanyID=N'101',@chrRoleCode=N'${data.RoleCode}',@chrParent=N'0',@intModuleNo=${data.ModuleNo}`
    };

    let parrent = await this.getUserSpdata(obj2);
    let promises = parrent.map(async (ele) => {
      ele["expand"] = false
      let obj3 = {
        name: "Sel_RoleAccess",
        params: `@chrOption=N'1',@chrCompanyID=N'101',@chrRoleCode=N'101001',@chrParent=N'${ele.MENU_KEY}',@intModuleNo=${data.ModuleNo}`
      };
      let temp = await this.getUserSpdata(obj3);
      // return temp
      let updatedTemp = temp.map((item) => {
        // Create a copy of the current item and add the new property
        let newItem = { ...item, checked: true }; // Set the value of 'check' as you desire
        return newItem;
      });
      ele["childs"] = updatedTemp;

      return ele;
    });
    let ori_result: any = await Promise.all(promises);
    let result: any = ori_result.map(x => Object.assign({}, x));
    let childPromises: Promise<any>[] = [];
    for (let ele12 of result) {
      let promise = this.config.executeUserQuery(`select MENU_KEY, MENU_CAPTION, NULL AS IS_AVAILABLE, MENU_OPTION_TYPE from menus where PARENT = ${ele12.MENU_KEY}`);
      ele12.childs = await promise

      childPromises.push(ele12);
    }
    // return await result;
    let child_result = await Promise.all(childPromises);


    // Merge child objects without duplicating
    let mergedChilds = ori_result.map(item => {
      let foundItem = child_result.find(child => child.MENU_KEY === item.MENU_KEY);
      if (foundItem) {
        return {
          ...item,
          childs: item.childs.concat(foundItem.childs.filter(child => !item.childs.find(existing => existing.MENU_KEY === child.MENU_KEY)))
        };
      } else {
        return item;
      }
    });



    return await ori_result;
  }

  async hash(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async changePassword(data) {
    if (data) {
      let old = await this.config.executeUserQuery(`SELECT * FROM USERS WHERE USER_ID = '${data.USER_ID}'`);
      if (old.length == 0) {
        return { status_code: 0, "message": "Invalid Old User" };
      } else {
        let temp = await this.authService.encrypt3DES(data.OLD_PASSWORD);
        if (
          // await bcrypt.compare(data.OLD_PASSWORD, old[0].NEW_PASSWORD)
          temp == old[0].PASSWORD
        ) {
          let NEW_PASSWORD = await this.authService.encrypt3DES(data.NEW_PASSWORD);
          await this.config.executeUserQuery(`UPDATE USERS SET PASSWORD = '${NEW_PASSWORD}' , VALID_TILL_DATE = '${data.VALID_TILL_DATE}' WHERE USER_ID = '${data.USER_ID}'`);
          await this.config.executeUserQuery(`INSERT INTO USERSLOG (COMPANY_ID,TRAN_DATE,USER_ID,OLD_PASSWORD,NEW_PASSWORD,TYPE,SYSCHNG_DATETIME,SYSCHNG_LOGIN, REMARK) VALUES(${data.COMPANY_ID}, ${moment().format("YYYYMMDD")}, '${data.USER_ID}','${await this.authService.encrypt3DES(data.OLD_PASSWORD)}', '${await this.authService.encrypt3DES(data.NEW_PASSWORD)}', NULL, '${moment().format('YYYYMMDDHH:mm:ss')}', '${data.USER_ID}', 'Change Password')`)
          return { status_code: 1, "message": "Password Reset Successfully." };
        } else {
          return { status_code: 0, "message": "Invalid Old Password" };
        }
      }
    }
  }

  async updateAssignUserWiseRoles(data: any) {
    // exec Del_UserRoles @chrCompanyID=101,@chrUserId=N'ABHI'
    await this.config.executeUserQuery(`exec Del_UserRoles @chrCompanyID=101,@chrUserId=N'${data.UserId}'`);
    data.RoleCode.forEach(async element => {
      // exec Ins_UserRoles @chrCompanyID=N'101',@chrUserId=N'ABHI',@chrRoleCode=N'101037'

      await this.config.executeUserQuery(`exec Ins_UserRoles @chrCompanyID=N'101',@chrUserId=N'${data.UserId}',@chrRoleCode=N'${element}'`);
    });
  }

  async getEmpDrp() {
    return await this.config.executeQuery(`Get_HelpList '101','MSTCOMMEMPLOYEE','','CODE, UPPER(NAME) AS NAME, PARENT_CODE, SUB_GLACNO, DISCLEVEL_CODE, REGION_CODE','STATUS_CODE = 0  And STATUS_CODE=0','NAME',1`);
  }

  async resetPassword(data) {
    return await this.config.executeUserQuery(`UPDATE USERS SET NEW_PASSWORD = '${await this.hash('123456')}' WHERE USER_ID = '${data.USER_ID}'`)
  }

  async enableDisableUser(data) {
    return await this.config.executeUserQuery(`UPDATE USERS SET STATUS_CODE = '${data.STATUS_CODE}' WHERE USER_ID = '${data.USER_ID}'`)
  }

  async updateBusinessInformation(data) {
    let queryArray = new Array();

    let dataset2 = {};
    dataset2 = {
      "data": data._CNFCOMPANY,
      "condition": [{
        "COMPANY_ID": data._CNFCOMPANY.COMPANY_ID
      }],
      "tableName": "CNFCOMPANY"
    }
    queryArray.push(await this.config.updateData(dataset2, 'user'));
    return await this.config.executeInsertQuery(queryArray);

    // const { _CNFCOMPANY } = data
    // if (_CNFCOMPANY) {
    //   const SysDateTime = await await this.config.executeQuery(`Get_SYSDATETIME`);

    //   const CNFCOMPANY_table_data = await this.config.executeUserQuery('select * from CNFCOMPANY')

    //   let fetch_userData = CNFCOMPANY_table_data.filter(res => res.COMPANY_ID == _CNFCOMPANY.COMPANY_ID)
    //   _CNFCOMPANY["SYSADD_DATETIME"] = SysDateTime[0]['']
    //   _CNFCOMPANY["SYSCHNG_DATETIME"] = SysDateTime[0]['']
    //   for (let item in fetch_userData[0]) {
    //     if (fetch_userData[0][item] != _CNFCOMPANY[item] && _CNFCOMPANY.hasOwnProperty(item)) {
    //       await this.config.executeUserQuery(`UPDATE CNFCOMPANY SET ${item}='${_CNFCOMPANY[item]}' WHERE COMPANY_ID = ${_CNFCOMPANY.COMPANY_ID}`)
    //     }
    //   }

    //   return true
    // }
    // return false
  }

  // async getMenusModuleWise(body) {
  //   ///---------- Body in following format
  //   /*
  //     {
  //       MODULE : [10,20,25,30,35,90,99],
  //       ROLE_CODE :100001 
  //     }
  //   */
  //   ///Get Module details
  //   let modules: any = await this.config.executeUserQuery(`select MODULE_NO as id,MODULE_NAME as label from Modules where STATUS_CODE = 0 and MODULE_NO in (${body.MODULE})`);
  //   for (let item of modules) {
  //     let subArray = await this.config.executeUserQuery(`select MODULE_NO as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = 0`);
  //     if (subArray.length != 0) {
  //       item['subItems'] = subArray;
  //       if (subArray.length != 0) {
  //         for (let ele of subArray) {
  //           if (ele.link == null || ele.link == "") {
  //             delete ele.link
  //           }
  //           let subSubArray = await this.config.executeUserQuery(`select PARENT as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = ${ele.id}`);
  //           if (subSubArray.length != 0) {
  //             ele['subItems'] = subSubArray;
  //             if (subSubArray.length != 0) {
  //               for (let ele1 of subSubArray) {
  //                 if (ele1.link == null || ele1.link == "") {
  //                   delete ele1.link
  //                 }
  //                 let subSub1Array = await this.config.executeUserQuery(`select PARENT as parentId,MENU_CAPTION as label,MENU_NAV_PAGE as link,MENU_KEY as id from Menus where MODULE_NO = ${item.id} and IS_VISIBLE = 0 and PARENT = ${ele1.id}`);
  //                 if (subSub1Array.length != 0) {
  //                   ele1['subItems'] = subSub1Array;
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   //---------- Check Mensus allow or not 
  //   for (let item of modules) {
  //     if (item.hasOwnProperty("subItems")) {
  //       for (let item_subItem of item.subItems) {
  //         for (let item_subItemSubItem of item_subItem.subItems) {
  //           if (item_subItemSubItem.hasOwnProperty("id")) {
  //             let isAllow: any = await this.config.executeUserQuery(`select * from RoleAccess where MENU_KEY = ${item_subItemSubItem.id} AND ROLE_CODE = ${body.ROLE_CODE}`);
  //             if (isAllow.length != 0) {
  //               item_subItemSubItem["isAllow"] = true;
  //             } else {
  //               item_subItemSubItem["isAllow"] = false;
  //             }
  //           }
  //         }

  //       }
  //     }
  //   }
  //   return modules;
  // }

  // async getMenusModuleWise(body) {
  //   const { MODULE, ROLE_CODE } = body;

  //   // Fetch all required data in a single shot
  //   const [modules, menus, roleAccess] = await Promise.all([
  //     this.config.executeUserQuery(`
  //       SELECT MODULE_NO as id, MODULE_NAME as label 
  //       FROM Modules 
  //       WHERE STATUS_CODE = 0 AND MODULE_NO IN (${MODULE})
  //     `),
  //     this.config.executeUserQuery(`
  //       SELECT MODULE_NO, MENU_KEY as id, MENU_CAPTION as label, MENU_NAV_PAGE as link, PARENT, IS_VISIBLE
  //       FROM Menus
  //       WHERE MODULE_NO IN (${MODULE}) AND IS_VISIBLE = 0
  //     `),
  //     this.config.executeUserQuery(`
  //       SELECT MENU_KEY 
  //       FROM RoleAccess 
  //       WHERE ROLE_CODE = ${ROLE_CODE}
  //     `)
  //   ]);

  //   // Convert roleAccess result into a Set for faster lookup
  //   const allowedMenus = new Set(roleAccess.map(ra => ra.MENU_KEY));

  //   // Convert menus into a map for fast parent-child assignment
  //   const menuMap = new Map();
  //   menus.forEach(menu => {
  //     menu.subItems = [];
  //     menu.isAllow = allowedMenus.has(menu.id); // Set permission
  //     if (!menuMap.has(menu.id)) menuMap.set(menu.id, menu);
  //   });

  //   // Build hierarchy
  //   menus.forEach(menu => {
  //     if (menu.PARENT !== 0) {
  //       const parentMenu = menuMap.get(menu.PARENT);
  //       if (parentMenu) {
  //         parentMenu.subItems.push(menu);
  //       }
  //     }
  //   });

  //   // Attach menu structure to modules
  //   for (let module of modules) {
  //     module.subItems = menus.filter(menu => menu.MODULE_NO === module.id && menu.PARENT === 0);
  //   }

  //   return modules;
  // }

  async getMenusModuleWise(body) {
    const { MODULE, ROLE_CODE } = body;

    // Fetch all required data in a single shot
    const [modules, menus, roleAccess] = await Promise.all([
      this.config.executeUserQuery(`
        SELECT MODULE_NO as id, MODULE_NAME as label 
        FROM Modules 
        WHERE STATUS_CODE = 0 AND MODULE_NO IN (${MODULE})
      `),
      this.config.executeUserQuery(`
        SELECT MODULE_NO, MENU_KEY as id, MENU_CAPTION as label, MENU_NAV_PAGE as link, PARENT, IS_VISIBLE
        FROM Menus
        WHERE MODULE_NO IN (${MODULE}) AND IS_VISIBLE = 0
      `),
      this.config.executeUserQuery(`
        SELECT MENU_KEY 
        FROM RoleAccess 
        WHERE ROLE_CODE = ${ROLE_CODE}
      `)
    ]);

    // Convert roleAccess result into a Set for fast lookup
    const allowedMenus = new Set(roleAccess.map(ra => ra.MENU_KEY));

    // Convert menus into a map for fast parent-child assignment
    const menuMap = new Map();
    menus.forEach(menu => {
      menu.isAllow = allowedMenus.has(menu.id); // Set permission
      if (!menuMap.has(menu.id)) menuMap.set(menu.id, menu);
    });

    // Build hierarchy without adding unnecessary subItems
    menus.forEach(menu => {
      if (menu.PARENT !== 0) {
        const parentMenu = menuMap.get(menu.PARENT);
        if (parentMenu) {
          if (!parentMenu.subItems) parentMenu.subItems = []; // Add subItems only when needed
          parentMenu.subItems.push(menu);
        }
      }
    });

    // Attach structured menus to modules
    for (let module of modules) {
      module.subItems = menus.filter(menu => menu.MODULE_NO === module.id && menu.PARENT === 0);
    }

    return modules;
  }



  async updateMenusModuleWise(data: any) {
    /**
     * 
     * data.data have menus data for update 
     */
    // COMPANY_ID	,ROLE_CODE	,MODULE_NO	, MENU_KEY

    await this.config.executeUserQuery(`delete from RoleAccess where ROLE_CODE = ${data.ROLE_CODE}`);

    for (let item of data.data) {
      if (item.hasOwnProperty("subItems")) {
        for (let item_subItem of item.subItems) {
          if (item_subItem.hasOwnProperty("subItems")) {
            for (let item_subItemSubItem of item_subItem.subItems) {
              if (item_subItemSubItem.hasOwnProperty("id")) {
                if (item_subItemSubItem.isAllow) {
                  let q: any = `INSERT INTO RoleAccess (COMPANY_ID	,ROLE_CODE	,MODULE_NO	, MENU_KEY) VALUES(${data.COMPANY_ID}, ${data.ROLE_CODE},${item.id},${item_subItemSubItem.id})`
                  await this.config.executeUserQuery(q);
                }
              }
            }
          } else {
            if (item_subItem.hasOwnProperty("id")) {
              if (item_subItem.isAllow) {
                let q: any = `INSERT INTO RoleAccess (COMPANY_ID	,ROLE_CODE	,MODULE_NO	, MENU_KEY) VALUES(${data.COMPANY_ID}, ${data.ROLE_CODE},${item.id},${item_subItem.id})`
                await this.config.executeUserQuery(q);
              }
            }

          }

        }
      }
    }
  }

  async db_Backup(path: {
    DATABASE_BACKUP_PATH: string,
    MAIN_DATABASE: string,
    MAIN_DATABASE_BACKUP_PATH: string,
    USER_DATABASE: string,
    USER_DATABASE_BACKUP_PATH: string
  }) {
    await this.config.executeQuery(`exec sp_backupDb @dbname=N'${__MSSQL_DATABASE_MAIN}',@filepath=N'${path.MAIN_DATABASE_BACKUP_PATH}'`);
    await this.config.executeQuery(`exec sp_backupDb @dbname=N'${__MSSQL_DATABASE_USER}',@filepath=N'${path.USER_DATABASE_BACKUP_PATH}'`);
    return { status: true };
  }

  async checkUSER_ID(body: any) {
    return await this.config.executeUserQuery(`select COMPANY_ID, NAME, USER_ID from USERS WHERE USER_ID = '${body.USER_ID}'`)
  }

  async insertUserRoles(data: any) {
    let USRUserRoles: any = data.USRUserRoles;
    let USRUserRoles_Deleted: any = data.USRUserRoles_Deleted;
    for (let item of USRUserRoles_Deleted) {
      await this.config.executeUserQuery(`DELETE FROM UserRoles WHERE USER_ID = '${data.USER_ID}' AND ROLE_CODE = ${item.ROLE_CODE}`);
    }

    if (USRUserRoles.length > 0) {
      await this.config.executeUserQuery(`DELETE FROM UserRoles WHERE USER_ID = '${data.USER_ID}'`);
      for (let item of USRUserRoles) {
        await this.config.executeUserQuery(`INSERT INTO UserRoles (COMPANY_ID, USER_ID, ROLE_CODE) VALUES('${item.COMPANY_ID}','${item.USER_ID}','${item.ROLE_CODE}')`);
      }
    }
  }

  async insertCallType(@Body() body) {
    let MSTCOMMCALLTYPE: any = body.MSTCOMMCALLTYPE;
    let sysDate = await this.config.executeQuery(`Get_SYSDATETIME`);
    if (MSTCOMMCALLTYPE.CODE) {
      //------------- update
      await this.config.executeQuery(`DELETE FROM MSTCOMMCALLTYPE WHERE CODE = ${MSTCOMMCALLTYPE.CODE}`);
      MSTCOMMCALLTYPE['SYSCHNG_DATETIME'] = sysDate[0][''];
    } else {
      //------------------ Insert
      let code: any = this.config.executeQuery(`exec Get_Next_Master_Code @COMPANY_ID='10 ',@TABLE_NAME='MSTCOMMCALLTYPE',@Code_Colum='CODE',@Code_Len=6,@Code_Prefix=''`);
      MSTCOMMCALLTYPE["CODE"] = code[0][''];
      MSTCOMMCALLTYPE['SYSADD_DATETIME'] = sysDate[0][''];
    }
    MSTCOMMCALLTYPE["tableName"] = "MSTCOMMCALLTYPE";
    await this.config.insertData(MSTCOMMCALLTYPE);
  }

  async updateCNFCOMPANY(data) {
    //********* update *********//
    let tableName = "CNFCOMPANY"
    let COMPANY_ID = data.COMPANY_ID;
    delete data['COMPANY_ID'];

    let dataset = {};
    dataset = {
      "data": data,
      "condition": [{
        "COMPANY_ID": COMPANY_ID
      }],
      "tableName": tableName
    }
    return await this.config.executeInsertQuery([await this.config.updateData(dataset)]);
  }

}
