import { Module } from '@nestjs/common';
import { PumpCommonController } from './pump-common.controller';
import { PumpCommonService } from './pump-common.service';
import { SQL } from 'src/database/sql.sql';

@Module({
  controllers: [PumpCommonController],
  providers: [PumpCommonService, SQL]
})
export class PumpCommonModule { }
