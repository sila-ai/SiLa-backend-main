import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import * as dotenv from 'dotenv';
import { CustomersService } from '../customers/customers.service';
dotenv.config()

@Injectable()
export class InvoiceService {
    private readonly stripe: Stripe = stripe;

    constructor(
        private readonly customersService: CustomersService
    ) { }

    async create(invoiceInfo: any) {
        return await this.stripe.invoices.create(invoiceInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE)
        })
    }

    async findOne(invoiceId: string) {
        return await this.stripe.invoices.retrieve(invoiceId).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async findCustomerInvoice(customerId: string) {
        const customerInfo =  await this.customersService.findStripeCustomerId(customerId);
        const response: any =  await this.stripe.invoices.list({customer:customerId}).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
        response.count = response.data.length;
        return response;
    }

    async findStripeCustomerInvoice(customerId: string) {
        const response =  await this.stripe.invoices.list({customer:customerId}).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
        return response;
    }

    async updateInvoice(id: string, invoiceInfo: any) {
        return await this.stripe.invoices.update(id, invoiceInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_MODIFIED)
        })
    }
}
