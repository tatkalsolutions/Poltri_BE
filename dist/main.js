"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const express_1 = require("express");
const express = require("express");
const config_config_1 = require("./config/config.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: true,
    });
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        res.header('Access-Control-Allow-Private-Network', true);
        next();
    });
    app.enableCors({
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
    });
    app.use((0, express_1.json)({
        limit: '50000mb'
    }));
    app.use((0, express_1.urlencoded)({
        limit: "50000mb",
        extended: true,
        parameterLimit: 50000000
    }));
    app.use('/uploads', express.static((0, path_1.join)(__dirname, '..', 'uploads')));
    await app.listen(config_config_1.__BE_PORT, config_config_1.__BE_OPEN_TO);
    console.log("Backend Start On ", config_config_1.__BE_PORT, " For IP ", config_config_1.__BE_OPEN_TO);
    console.log(`Memory Usage: ${JSON.stringify(process.memoryUsage())}`);
}
bootstrap();
//# sourceMappingURL=main.js.map