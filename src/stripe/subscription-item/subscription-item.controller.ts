import { 
    Controller,
    Get,
    Response,
    HttpStatus,
    Body,
    Post,
} from '@nestjs/common';
import { CreateSubscriptionItemDto } from './dto/createSubscriptionItem.dto';
import { SubscriptionItemService } from './subscription-item.service';

@Controller('subscription-item')
export class SubscriptionItemController {
    constructor(
        private readonly subscriptionItemService: SubscriptionItemService
    ) {}

    @Post('create')
    public async createSubscription(
        @Response() res,
        @Body() createSubscriptionItemDto: CreateSubscriptionItemDto,
        ) {
        const subscriptions = await this.subscriptionItemService.createSubscriptionItem(
            createSubscriptionItemDto,
        );
        
        return res.status(HttpStatus.OK).json(subscriptions);
    }
}
