import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthService } from 'src/auth/auth.service';
import { SQL } from 'src/database/sql.sql';

@Module({
  controllers: [AdminController],
  providers: [AdminService, SQL, AuthService],
})
export class AdminModule { }
