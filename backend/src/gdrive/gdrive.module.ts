import { Module } from '@nestjs/common';
import { GdriveService } from './gdrive.service';
import { GdriveController } from './gdrive.controller';

@Module({
  providers: [GdriveService],
  controllers: [GdriveController],
})
export class GdriveModule {}
