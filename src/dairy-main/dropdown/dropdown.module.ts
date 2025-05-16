import { Module } from '@nestjs/common';
import { DropdownController } from './dropdown.controller';
import { DropdownService } from './dropdown.service';
import { SQL } from 'src/database/sql.sql';

@Module({
  controllers: [DropdownController],
  providers: [DropdownService, SQL]
})
export class DropdownModule { }
