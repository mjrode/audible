import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cors from 'cors';
require('dotenv-flow').config();
import * as expressListRoutes from 'express-list-routes';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('*', cors());
  app.setGlobalPrefix('api');

  const envVars = Object.entries(process.env).filter(entry => {
    const [key, value] = entry;
    if (!key.includes('npm')) return [key, value];
  });
  const server = app.getHttpServer();
  const router = server._events.request._router;
  console.log(expressListRoutes({}, 'API:', router));
  await app.listen(5000);
}
bootstrap();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
