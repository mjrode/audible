import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cors from 'cors';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('*', cors());
  app.setGlobalPrefix('api');

  const envVars = Object.entries(process.env).filter(entry => {
    const [key, value] = entry;
    if (!key.includes('npm')) return [key, value];
  });

  console.log('NODE_ENV', envVars);
  await app.listen(5000);
}
bootstrap();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
