import { Module } from '@nestjs/common';
import { BankAccountModule } from './bank-account/bank-account.module';
import { CardModule } from './card/card.module';
import { CustomersModule } from './customers/customers.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PlansModule } from './plans/plans.module';
import { PricesModule } from './prices/prices.module';
import { ProductsModule } from './products/products.module';
import { SubscriptionSchedulesModule } from './subscription-schedules/subscription-schedules.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { InvoiceModule } from './invoice/invoice.module';
import { SubscriptionItemModule } from './subscription-item/subscription-item.module';
import { SessionModule } from './session/session.module';
import { PaymentIntentModule } from './payment-intent/payment-intent.module';
import { StripeModule as NextJSStripeModule } from 'nestjs-stripe'

@Module({
  controllers: [],
  imports: [
    NextJSStripeModule.forRoot({
      apiKey: process.env.STRIPE_API_KEY,
      apiVersion: '2020-08-27',
    }),
    CustomersModule,
    ProductsModule,
    PricesModule,
    PlansModule,
    PaymentMethodModule,
    SubscriptionSchedulesModule,
    BankAccountModule,
    CardModule,
    InvoiceModule,
    SubscriptionItemModule,
    SessionModule,
    PaymentIntentModule,
  ],
  providers: [],
})
export class StripeModule {}
