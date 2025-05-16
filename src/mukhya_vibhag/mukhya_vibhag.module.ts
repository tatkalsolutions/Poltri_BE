import { Module } from '@nestjs/common';
import { MukhyaVibhagController } from './mukhya_vibhag.controller';
import { MukhyaVibhagService } from './mukhya_vibhag.service';
import { SQL } from 'src/database/sql.sql';

@Module({
  controllers: [MukhyaVibhagController],
  providers: [MukhyaVibhagService, SQL]
})
export class MukhyaVibhagModule { }
