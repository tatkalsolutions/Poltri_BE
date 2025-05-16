import { Module } from '@nestjs/common';
import { DropdownModule } from './dropdown/dropdown.module';

@Module({
  imports: [DropdownModule]
})
export class DairyMainModule {}
