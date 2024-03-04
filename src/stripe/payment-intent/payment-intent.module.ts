import { Module } from '@nestjs/common';
import { PaymentIntentController } from './payment-intent.controller';
import { PaymentIntentService } from './payment-intent.service';

@Module({
    imports: [],
    providers: [PaymentIntentService],
    exports: [PaymentIntentService],
    controllers: [PaymentIntentController],
})
export class PaymentIntentModule { }
