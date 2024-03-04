// require('dotenv').config()
import { Module } from '@nestjs/common';

import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Subscription } from '../stripe/subscriptions/subscription.entity';
import { Notification } from 'src/notification/notificaiton.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Subscription]),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [TrafficController],
  providers: [TrafficService],
})
export class TrafficModule {}
