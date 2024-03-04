import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionSchedulesController } from './subscription-schedules.controller';
import { SubscriptionSchedules } from './subscription-schedules.entity';
import { SubscriptionSchedulesService } from './subscription-schedules.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionSchedules]), ScheduleModule.forRoot(),EmailModule],
  providers: [SubscriptionSchedulesService, EmailService],
  exports: [SubscriptionSchedulesService, EmailService],
  controllers: [SubscriptionSchedulesController],
})
export class SubscriptionSchedulesModule {}
