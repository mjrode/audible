import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
require('custom-env').env();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  await app.listen(5000);
}
bootstrap();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
