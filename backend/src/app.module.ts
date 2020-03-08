import { Module } from '@nestjs/common';
import { AudioBayModule } from './audiobay/audiobay.module';
import { TransmissionModule } from './transmission/transmission.module';
import { GdriveModule } from './gdrive/gdrive.module';
@Module({
  imports: [AudioBayModule, TransmissionModule, GdriveModule],
})
export class AppModule {}
