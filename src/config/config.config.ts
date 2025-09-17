//-------------- BE Config 
export const __BE_PORT: number = 2014;
export const __BE_OPEN_TO: string = '0.0.0.0';

//------------ SMTP Config 
export const __FROM_MAIL: string = "yourmail@demo.com";
export const __FROM_MAIL_PASSWORD: string = "XXX XXX XXX XXX";

//------------------- Cloud
export const __CLOUD_PATH: string = "../../cloud";


//-------------- DB Config - MSSQL
/**
 * To Create new instance follow rules 
 * 1) Use following name if u create multiple then just Use _ (underscore) and name of database 
 * for example  `__MSSQL_DATABASE_MAIN` where `MAIN` is database name
 * 2)  for same for server variables 
 *  
 */
export const __DATABASE_TYPE: "MYSQL" | "MSSQL" = "MSSQL";
export const DATABASE_BACKUP_PATH: string = `E:\\Projects\\poultry_farm_house\\DB_Backup`; //------------- dont Include \\ on end ,  Use this path for both main and user databse backup
export const DATABASE_AUTO_BACKUP_PATH: string = `E:\\Projects\\poultry_farm_house\\DB_Backup\\auto`;
export const DATABASE_AUTO_BACKUP_ENABLE: boolean = false;
//--------- For MSSQL
export const __MSSQL_DB_SERVER: string = 'SAWANT-INFOTECH'; //------- also used for crystal report 
// export const __MSSQL_DATABASE_MAIN: string = 'POULTRYFARM_ACC';//------- also used for crystal report 
// export const __MSSQL_DATABASE_MAIN: string = 'X_DEL_POULTRYFARM_2107';//------- also used for crystal report 
export const __MSSQL_DATABASE_MAIN: string = 'POULTRYFARM_20250917';//------- also used for crystal report 

export const __MSSQL_DB_PORT: number = 1433;
export const __MSSQL_DB_USER: string = "shubham"; //------- also used for crystal report 
export const __MSSQL_DB_PASSWORD: string = "123456789"; //------- also used for crystal report 

export const __MSSQL_DATABASE_USER: string = 'POULTRYFARMUSERS';
//--------- For MySQL
export const __MYSQL_DB_SERVER: string = '';
export const __MYSQL_DB_PORT: number = 3306;
export const __MYSQL_DB_USER: string = "root"
export const __MYSQL_DB_PASSWORD: string = '';

export const __MYSQL_DATABASE_MAIN: string = '';
export const __MYSQL_DATABASE_USER: string = '';



//------------ Crystal Report 
export const __REPORT_BASE_PATH: string = '../assets/report/';
export const __REPORT_OUTPUT_PATH: string = '/output/';