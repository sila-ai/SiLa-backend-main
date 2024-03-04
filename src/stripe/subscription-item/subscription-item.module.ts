import { Module } from '@nestjs/common';
import { SubscriptionItemController } from './subscription-item.controller';
import { SubscriptionItemService } from './subscription-item.service';

@Module({
    imports: [],
    providers: [SubscriptionItemService],
    exports: [SubscriptionItemService],
    controllers: [SubscriptionItemController],
})
export class SubscriptionItemModule { }
