import { Module } from '@nestjs/common';
import { PumpCommonModule } from './pump-common/pump-common.module';

@Module({
  imports: [PumpCommonModule]
})
export class PumpModule {}
