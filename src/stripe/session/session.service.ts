import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import * as moment from 'moment';
import * as dotenv from 'dotenv';
import { CustomersService } from '../customers/customers.service';
dotenv.config()

@Injectable()
export class SessionService {
    private readonly stripe: Stripe = stripe;

    constructor(
        private readonly customersService: CustomersService,
    ) { }
    
    async findAllSession() {
        return await this.stripe.checkout.sessions.list().catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }
    
    async findSession(id: string) {
        return await this.stripe.checkout.sessions.retrieve(id).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async getAddonTotalClicks(id: string) {
        const response: any = await this.stripe.checkout.sessions.list().catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })

        let total_clicks : number = 0;
        if (response['data'].length) {
            for (let i of response['data']) {
                if(i['customer'] === id && i['payment_status'] == "paid")
                {
                    const line_response: any = await this.stripe.checkout.sessions.listLineItems(i['id']);
                    if (line_response['data'].length) {
                        // return line_response['data'];
                        for (let j of line_response['data']) {
                            const click : number = j['price'].nickname ? parseInt(j['price'].nickname) : 0;
                            total_clicks = total_clicks + click;
                        }
                    }
                }
            }
        }
        return total_clicks;
    }

    async findSessionItem(id: string) {
        return await this.stripe.checkout.sessions.listLineItems(id).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async createSession(sessionInfo: any) {
        //Set payment method Id as default_payment_method in customer
        return await this.stripe.checkout.sessions.create({
            success_url: "https://silasuite.com/#/user/success/1",
            cancel_url: "https://silasuite.com/#/user/failed/2",
            payment_method_types: ['card'],
            line_items: [
                {price: sessionInfo.price, quantity: 1},
            ],
            mode: 'payment',
            customer: sessionInfo.customer,
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        })
    }
}
