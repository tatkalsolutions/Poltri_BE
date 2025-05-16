import { Module } from '@nestjs/common';
import { PashukhadyautpadanCommonController } from './pashukhadyautpadan-common.controller';
import { PashukhadyautpadanCommonService } from './pashukhadyautpadan-common.service';
import { SQL } from 'src/database/sql.sql';

@Module({
  controllers: [PashukhadyautpadanCommonController],
  providers: [PashukhadyautpadanCommonService, SQL]
})
export class PashukhadyautpadanCommonModule { }
