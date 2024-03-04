import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import * as dotenv from 'dotenv';
dotenv.config()

@Injectable()
export class SubscriptionItemService {
    private readonly stripe: Stripe = stripe;

    async createSubscriptionItem(subscriptionItemInfo: any){
        subscriptionItemInfo.quantity = 1;
        return await this.stripe.subscriptionItems.create(subscriptionItemInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE)
        })
    }
}
