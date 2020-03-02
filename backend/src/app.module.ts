
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'; // add this
import { AudioBayModule } from './audiobay/audiobay.module';
import { TransmissionModule } from './transmission/transmission.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-blog-project', {
      useNewUrlParser: true,
    }),
    AudioBayModule,
    TransmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
