import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { CustomersModule } from '../customers/customers.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), ScheduleModule.forRoot(),EmailModule,CustomersModule, InvoiceModule, ProductsModule,UsersModule],
  providers: [SubscriptionsService, EmailService],
  exports: [SubscriptionsService, EmailService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
