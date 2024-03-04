import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private schedulerRegistry: SchedulerRegistry) { }

  private readonly logger = new Logger(CronService.name);

  callsCount = 0;
  dynamicCallsCount = 0;

  // @Cron(CronExpression.EVERY_MINUTE)
  // handleCron() {
  //     this.logger.debug('Called every minute');
  // }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'EXECUTES_EVERY_30_SECONDS',
  })
  handleCronEvery30Seconds() {
    ++this.callsCount;
    if (this.callsCount === 1) {
      const ref = this.schedulerRegistry.getCronJob(
        'EXECUTES_EVERY_30_SECONDS',
      );
      ref!.stop();
    }
  }
  
  // @Cron('*/10 * * * * *')
  // runEvery10Seconds() {
  //     console.log('Every 10 seconds');
  // }

  // @Cron(CronExpression.EVERY_MINUTE)
  // runEveryMinute() {
  //     console.log('Every minute');
  // }

  // @Timeout(15000)
  // onceAfter15Seconds() {
  //     console.log('Called once after 15 seconds');
  // }
}