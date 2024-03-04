import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from '../customers/customers.module';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethod } from './payment-method.entity';
import { PaymentMethodService } from './payment-method.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod]),CustomersModule],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService],
  controllers: [PaymentMethodController],
})
export class PaymentMethodModule {}
