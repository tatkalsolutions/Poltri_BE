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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const sql_sql_1 = require("../database/sql.sql");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(config) {
        this.config = config;
        this.vector = Buffer.from([240, 3, 45, 29, 0, 76, 173, 59]);
        this.cryptoKey = "A quick brown fox jumped over lazy dog.";
    }
    async findOne(username) {
        return await this.config.executeUserQuery(`select * from USERS where USER_ID='${username}'`);
    }
    encrypt3DES(inputText) {
        const md5Key = crypto.createHash('md5').update(this.cryptoKey).digest();
        const tripleDesKey = Buffer.concat([md5Key, md5Key.slice(0, 8)]);
        const cipher = crypto.createCipheriv('des-ede3-cbc', tripleDesKey, this.vector);
        let encrypted = cipher.update(inputText, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }
    decrypt3DES(encryptedText) {
        const md5Key = crypto.createHash('md5').update(this.cryptoKey).digest();
        const tripleDesKey = Buffer.concat([md5Key, md5Key.slice(0, 8)]);
        const decipher = crypto.createDecipheriv('des-ede3-cbc', tripleDesKey, this.vector);
        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sql_sql_1.SQL])
], AuthService);
//# sourceMappingURL=auth.service.js.map