import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './payment-method.entity';
import { CustomersService } from '../customers/customers.service';
import { customer } from 'google-ads-api/build/src/protos/autogen/resourceNames';
@Injectable()
export class PaymentMethodService {
    private readonly stripe: Stripe = stripe;

    constructor(
        @InjectRepository(PaymentMethod)
        private paymentMethodRepository: Repository<PaymentMethod>,
        private readonly customersService: CustomersService,
    ) { }

    async findAllPaymentMethods(paymentMethodInfo: any) {
        return await this.stripe.paymentMethods.list(
            {
                customer: paymentMethodInfo.customer,
                type: paymentMethodInfo.type,
            }
        ).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async findPaymentMethod(id: string) {
        return await this.stripe.paymentMethods.retrieve(id).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async createPaymentMethod(paymentMethodInfo: any,CustomerId: string) {
        const createResponse = await this.stripe.paymentMethods.create({
            type: "card",
            card: {
                number: paymentMethodInfo.card_number,
                exp_month: paymentMethodInfo.exp_month,
                exp_year: paymentMethodInfo.exp_year,
                cvc: paymentMethodInfo.cvc,
            },
            billing_details: {
                name: paymentMethodInfo.name
            },
        }).catch(err => {
            console.log(err)
            throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE)
        });


        const customerInfo =  await this.customersService.findStripeCustomerId(CustomerId);

        /*Attach customerId to payment method */
        const attachObject: any = {
            "customer": CustomerId
        }
        const response = await this.stripe.paymentMethods.attach(createResponse.id, attachObject).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_MODIFIED)
        })
        
        const data: any = {
            paymentId: response.id,
            stripeObject: response.object,
            billing_details: JSON.stringify(response.billing_details),
            card: JSON.stringify(response.card),
            created: response.created,
            customer: response.customer,
            livemode: response.livemode,
            metadata: JSON.stringify(response.metadata),
            type: response.type
        }
        return await this.paymentMethodRepository.save(data);
    }

    async updatePaymentMethod(id: string, paymentMethodInfo: any) {
        const response = await this.stripe.paymentMethods.update(id, {
            card: {
                exp_month: paymentMethodInfo.exp_month,
                exp_year: paymentMethodInfo.exp_year,
            },
            billing_details: {
                name: paymentMethodInfo.name
            },
        }).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_MODIFIED)
        })

        const data: any = {
            stripeObject: response.object,
            billing_details: JSON.stringify(response.billing_details),
            card: JSON.stringify(response.card),
            created: response.created,
            customer: response.customer,
            livemode: response.livemode,
            metadata: JSON.stringify(response.metadata),
            type: response.type
        }
        return await this.paymentMethodRepository.update({"paymentId": id},data);
    }

    async attachPaymentMethod(id: string, paymentMethodInfo: any) {
        const response = await this.stripe.paymentMethods.attach(id, paymentMethodInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_MODIFIED)
        })

        const data: any = {
            customer: response.customer
        }
        return await this.paymentMethodRepository.update({"paymentId": id},data).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_MODIFIED)
        });
    }

    async detachPaymentMethod(id: string) {
        const response = await this.stripe.paymentMethods.detach(id).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        })

        const data: any = {
            customer: response.customer
        }
        return await this.paymentMethodRepository.update({"paymentId": id},data).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        });
    }
}
