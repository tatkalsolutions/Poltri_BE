import { Module } from '@nestjs/common';
import { PashukhayavibhagcommonService } from './pashukhayavibhagcommon.service';
import { PashukhayavibhagcommonController } from './pashukhayavibhagcommon.controller';
import { SQL } from 'src/database/sql.sql';

@Module({
  controllers: [PashukhayavibhagcommonController],
  providers: [PashukhayavibhagcommonService, SQL],
})
export class PashukhayavibhagcommonModule { }
