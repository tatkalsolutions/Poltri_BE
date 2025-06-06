import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SQL } from 'src/database/sql.sql';
import { CommonService } from 'src/common/common.service';
import * as moment from 'moment';
import { jwtConstants } from './constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private sql: SQL,
    private commonService: CommonService
  ) {
  }
  @Post()
  async signIn(@Body() data) {
    const user = await this.authService.findOne(data.username);
    let result: boolean = false
    if (user.length != 0) {
      if (user[0]["VALID_TILL_DATE"] != '0') {
        // ------- check password expiry 
        if (!(user[0]["VALID_TILL_DATE"] >= moment().format("YYYYMMDD"))) {
          return {
            STATUS_CODE: '2',
            MESSAGE: 'Password is expired! Please Contact to System Admin.',
          }
        }
      }
      let temp: any = this.authService.encrypt3DES(data.password);
      if (user[0]?.PASSWORD == temp) {
        //------------ password match
        result = true;
      }
    } else {
      return {
        STATUS_CODE: '1',
        MESSAGE: 'Invalid Username or Password',
      };
    }

    if (!result) {
      return {
        STATUS_CODE: '1',
        MESSAGE: 'Invalid Username or Password',
      };
    }
    const payload = { sub: user[0].userId, username: user[0].username };
    delete user[0].NEW_PASSWORD
    delete user[0].PASSWORD

    //-*--------------- Check Assigned Modules
    let userRole: any = await this.sql.executeUserQuery(`SELECT Roles.NAME FROM ROLES INNER JOIN UserRoles ON Roles.CODE = UserRoles.ROLE_CODE WHERE UserRoles.USER_ID = '${user[0].USER_ID}'`)
    let MENUS: any = [];
    if (userRole.length > 0) {
      MENUS = await this.commonService.getUserSpData({
        SPname: "Sel_GetModuleWiseMainMenu",
        params: [101, userRole[0].NAME, '0', 0]
      });
    }

    return {
      MODULES: MENUS.length,
      access_token: await this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: jwtConstants.expiresIn }),
      userInfo: user[0],
      STATUS_CODE: '0'
    };
  }
}
