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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const sql_sql_1 = require("../database/sql.sql");
const common_service_1 = require("../common/common.service");
const moment = require("moment");
let AuthController = class AuthController {
    constructor(authService, jwtService, sql, commonService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.sql = sql;
        this.commonService = commonService;
    }
    async signIn(data) {
        var _a;
        const user = await this.authService.findOne(data.username);
        let result = false;
        if (user.length != 0) {
            if (user[0]["VALID_TILL_DATE"] != '0') {
                if (!(user[0]["VALID_TILL_DATE"] >= moment().format("YYYYMMDD"))) {
                    return {
                        STATUS_CODE: '2',
                        MESSAGE: 'Password is expired! Please Contact to System Admin.',
                    };
                }
            }
            let temp = this.authService.encrypt3DES(data.password);
            if (((_a = user[0]) === null || _a === void 0 ? void 0 : _a.PASSWORD) == temp) {
                result = true;
            }
        }
        else {
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
        delete user[0].NEW_PASSWORD;
        let userRole = await this.sql.executeUserQuery(`SELECT Roles.NAME FROM ROLES INNER JOIN UserRoles ON Roles.CODE = UserRoles.ROLE_CODE WHERE UserRoles.USER_ID = '${user[0].USER_ID}'`);
        let MENUS = [];
        if (userRole.length > 0) {
            MENUS = await this.commonService.getUserSpData({
                SPname: "Sel_GetModuleWiseMainMenu",
                params: [101, userRole[0].NAME, '0', 0]
            });
        }
        return {
            MODULES: MENUS.length,
            access_token: await this.jwtService.sign(payload, { secret: 'BDS', expiresIn: '1h' }),
            userInfo: user[0],
            STATUS_CODE: '0'
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        sql_sql_1.SQL,
        common_service_1.CommonService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map