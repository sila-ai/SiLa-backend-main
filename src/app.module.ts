import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { UsersModule } from './users/users.module';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { StripeModule } from './stripe/stripe.module';
import { Customers } from './stripe/customers/customers.entity';
import { Products } from './stripe/products/products.entity';
import { Prices } from './stripe/prices/prices.entity';
import { Plans } from './stripe/plans/plans.entity';
import { PaymentMethod } from './stripe/payment-method/payment-method.entity';
import { Subscription } from './stripe/subscriptions/subscription.entity';
import { SubscriptionSchedules } from './stripe/subscription-schedules/subscription-schedules.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { EmailModule } from './email/email.module';
import { TrafficModule } from './traffic/traffic.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AdwordsModule } from './adwords/adwords.module';

import { UrlModule } from './url/url.module';
import * as dotenv from 'dotenv';
import { Contact } from './contact/contact.entity';
import { Notification } from './notification/notificaiton.entity';
import { NotificationModule } from './notification/notification.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [
        User,
        Contact,
        Customers,
        Products,
        Prices,
        Plans,
        PaymentMethod,
        Subscription,
        SubscriptionSchedules,
        Notification,
      ],
      synchronize: true,
    }),
    UsersModule,
    ContactModule,
    StripeModule,
    AuthModule,
    ScheduleModule,
    EmailModule,
    TrafficModule,
    UrlModule,
    AnalyticsModule,
    AdwordsModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [AppGateway, CronService],
})

// @Module({
//   imports: [
//     TrafficModule ],
// })
export class AppModule {}
