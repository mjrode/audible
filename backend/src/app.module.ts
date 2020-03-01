// blog-backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'; // add this
import { BlogModule } from './blog/blog.module';
import { AudioBayModule } from './audiobay/audiobay.module'
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-blog-project', { useNewUrlParser: true }),
    BlogModule,
    AudioBayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}