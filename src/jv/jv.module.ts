import { Module } from '@nestjs/common';
import { JvService } from './jv.service';
import { JvController } from './jv.controller';
import { BOTRANACCTPOST } from 'src/BOTrans/BOTranacctpost';
import { SQL } from 'src/database/sql.sql';
import { BOTRNACCTMATH } from 'src/BOTrans/BOTranacctmath';
import { BOTRNACCTMATIOUTSTAND } from 'src/BOTrans/BOTranacctmatioutstand';

@Module({
  controllers: [JvController],
  providers: [JvService, SQL, BOTRNACCTMATH, BOTRANACCTPOST, BOTRNACCTMATIOUTSTAND]
})
export class JvModule { }
