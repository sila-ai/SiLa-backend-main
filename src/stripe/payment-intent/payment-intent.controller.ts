import { 
    Controller,
    Get,
    Response,
    HttpStatus,
    Param,
} from '@nestjs/common';
import { PaymentIntentService } from './payment-intent.service';

@Controller('payment-intent')
export class PaymentIntentController {
    constructor(
        private readonly paymentIntentService: PaymentIntentService,
    ) {}

    @Get('/:id')
    public async getPaymentIntent(@Response() res, @Param() param) {
        const sessions = await this.paymentIntentService.findPaymentIntent(param.id);
        return res.status(HttpStatus.OK).json(sessions);
    }
}
