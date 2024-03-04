// require('dotenv').config()
import { Module } from '@nestjs/common';

import { AdwordsService } from './adwords.service';
import { AdwordsController } from './adwords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdwordsController],
  providers: [AdwordsService],
})
export class AdwordsModule {}
