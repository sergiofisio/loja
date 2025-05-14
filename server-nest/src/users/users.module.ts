import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DatabaseModule, HttpModule],
})
export class UsersModule {}
