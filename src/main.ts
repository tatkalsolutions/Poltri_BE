import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json, urlencoded } from 'express';
import * as express from 'express';
import { __BE_OPEN_TO, __BE_PORT } from './config/config.config';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.header('Access-Control-Allow-Private-Network', true)
    next();
  });
  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
  });
  app.use(json({
    limit: '50000mb'
  }));
  app.use(urlencoded({
    limit: "50000mb",
    extended: true,
    parameterLimit: 50000000
  }));
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(__BE_PORT, __BE_OPEN_TO);
  console.log("Backend Start On ", __BE_PORT, " For IP ", __BE_OPEN_TO)
  console.log(`Memory Usage: ${JSON.stringify(process.memoryUsage())}`);
}
bootstrap();