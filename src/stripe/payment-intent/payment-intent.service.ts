import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import * as dotenv from 'dotenv';
dotenv.config()

@Injectable()
export class PaymentIntentService {
    private readonly stripe: Stripe = stripe;

    constructor(
    ) { }
    
    async findPaymentIntent(id: string) {
        return await this.stripe.paymentIntents.retrieve(id).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }
}


