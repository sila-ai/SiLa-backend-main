import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import { Customers } from './customers.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class CustomersService {
  private readonly stripe: Stripe = stripe;

  constructor(
    @InjectRepository(Customers)
    private customersRepository: Repository<Customers>,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  async findAllCustomers() {
    return await this.stripe.customers.list().catch(err => {
      throw new HttpException(err, HttpStatus.NOT_FOUND)
    })
  }

  async findCustomer(id: string) {
    return await this.stripe.customers.retrieve(id).catch(err => {
      throw new HttpException(err, HttpStatus.NOT_FOUND)
    })
  }

  async findStripeCustomerId(id) {
    return {
      customerInfo:{
        customerId:id  
      }
      
    };
    // const response = await this.customersRepository.findOne(id);
    
    // return await this.customersRepository.findOne(id).catch(err => {
    //   throw new HttpException(err, HttpStatus.NOT_FOUND)
    // })
  }

  async createCustomer(customerInfo: any) {
    
    const response = await this.stripe.customers.create(customerInfo).catch(err => {
      
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    })
    const data: any = {
      customerId: response.id,
      stripeObject: response.object,
      address: response.address,
      balance: response.balance,
      created: response.created,
      currency: response.currency,
      default_source: response.default_source,
      delinquent: response.delinquent,
      description: response.description,
      discount: response.discount,
      email: response.email,
      isFirstTime:true,
      invoice_prefix: response.invoice_prefix,
      invoice_settings: JSON.stringify(response.invoice_settings),
      livemode: response.livemode,
      metadata: JSON.stringify(response.metadata),
      name: response.name,
      next_invoice_sequence: response.next_invoice_sequence,
      phone: response.phone,
      preferred_locales: JSON.stringify(response.preferred_locales),
      shipping: response.shipping,
      tax_exempt: response.tax_exempt
    }
    return await this.customersRepository.save(data);
  }

  async updateCustomer(id: string, customerInfo: any) {
    const response = await this.stripe.customers.update(id, customerInfo).catch(err => {
      throw new HttpException(err, HttpStatus.NOT_MODIFIED)
    })

    const data: any = {
      stripeObject: response.object,
      address: response.address,
      balance: response.balance,
      created: response.created,
      currency: response.currency,
      default_source: response.default_source,
      delinquent: response.delinquent,
      description: response.description,
      discount: response.discount,
      email: response.email,
      invoice_prefix: response.invoice_prefix,
      invoice_settings: JSON.stringify(response.invoice_settings),
      livemode: response.livemode,
      metadata: JSON.stringify(response.metadata),
      name: response.name,
      next_invoice_sequence: response.next_invoice_sequence,
      phone: response.phone,
      preferred_locales: JSON.stringify(response.preferred_locales),
      shipping: response.shipping,
      tax_exempt: response.tax_exempt
    }

    return await this.customersRepository.update({ "customerId": id }, data);
  }

  async deleteCustomer(id: string) {
    return await this.stripe.customers.del(id).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    })
  }

 // @Cron(CronExpression.EVERY_30_SECONDS)
  async handleNewCustomer() {

    const response = await this.stripe.customers.list().catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    })
    

    if (response != undefined) {
      for (let i of response['data']) {
        const findCustomer = await this.customersRepository.findOne({ where: { customerId: i.id } });
        if (!findCustomer) {
          
          const data: any = {
            customerId: i.id,
            stripeObject: i.object,
            address: i.address,
            balance: i.balance,
            created: i.created,
            currency: i.currency,
            default_source: i.default_source,
            delinquent: i.delinquent,
            description: i.description,
            discount: i.discount,
            email: i.email,
            invoice_prefix: i.invoice_prefix,
            invoice_settings: JSON.stringify(i.invoice_settings),
            livemode: i.livemode,
            metadata: JSON.stringify(i.metadata),
            name: i.name,
            next_invoice_sequence: i.next_invoice_sequence,
            phone: i.phone,
            preferred_locales: JSON.stringify(i.preferred_locales),
            shipping: i.shipping,
            tax_exempt: i.tax_exempt,
            cron_add: true
          }
         // this.customersRepository.save(data);
        } else {
          const data: any = {
            stripeObject: i.object,
            address: i.address,
            balance: i.balance,
            created: i.created,
            currency: i.currency,
            default_source: i.default_source,
            delinquent: i.delinquent,
            description: i.description,
            discount: i.discount,
            email: i.email,
            invoice_prefix: i.invoice_prefix,
            invoice_settings: JSON.stringify(i.invoice_settings),
            livemode: i.livemode,
            metadata: JSON.stringify(i.metadata),
            name: i.name,
            next_invoice_sequence: i.next_invoice_sequence,
            phone: i.phone,
            preferred_locales: JSON.stringify(i.preferred_locales),
            shipping: i.shipping,
            tax_exempt: i.tax_exempt,
            cron_update: true
          }
          this.customersRepository.update({ "customerId": i.id }, data);
        }
      }
    }
  }

  async generateToken(tokenInfo: any) {
    return await this.stripe.tokens.create(tokenInfo).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    })
  }
}
