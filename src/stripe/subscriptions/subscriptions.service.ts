import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';
import { CustomersService } from '../customers/customers.service';
import * as moment from 'moment';
import * as dotenv from 'dotenv';
import { InvoiceService } from '../invoice/invoice.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from 'src/users/users.service';
dotenv.config();

@Injectable()
export class SubscriptionsService {
  private readonly stripe: Stripe = stripe;

  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private schedulerRegistry: SchedulerRegistry,
    private readonly emailService: EmailService,
    private readonly invoiceService: InvoiceService,
    private readonly customersService: CustomersService,
    private readonly usersService:UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async findCustomerSubscription(customerId: string) {
    const customerInfo = await this.customersService.findStripeCustomerId(
      customerId,
    );

    const response: any = await this.stripe.subscriptions
      .list({ customer: customerId, status: 'all' })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.NOT_FOUND);
      });

    if (response != undefined) {
      for (let i of response['data']) {
        //Get product name
        const product = await this.productsService.findProduct(i.plan.product);
        i['product_name'] = product ? product.name : 'null';
      }
    }
    response.count = response.data.length;
    return response;
  }

  async findCustomerActiveSubscription(customerId: string) {
    const customerInfo = await this.customersService.findStripeCustomerId(
      customerId,
    );
    const response: any = await this.stripe.subscriptions
      .list({ customer: customerId })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.NOT_FOUND);
      });

    response.count = response.data.length;
    return response;
  }

  async findCustomerLatestSubscription(customerId: string) {
    const customerInfo = await this.customersService.findStripeCustomerId(
      customerId,
    );

    const response: any = await this.stripe.subscriptions
      .list({ customer: customerId })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.NOT_FOUND);
      });

    if (response != undefined) {
      for (let i of response['data']) {
        var end = moment.unix(i.current_period_end).format('YYYY-MM-DD');
        var given = moment(end, 'YYYY-MM-DD');
        var current = moment().startOf('day');

        //Difference in number of days
        var diff = moment.duration(given.diff(current)).asDays();

        i['remaining_days'] = diff ? diff : 0;

        //Get product name
        const product = await this.productsService.findProduct(i.plan.product);
        i['product_name'] = product ? product.name : 'null';
      }
    }
    return response.data;
  }

  async findAllSubscription() {
    const response: any = await this.stripe.subscriptions
      .list({
        limit: 100,
        // starting_after: "sub_JRJzg9UD6wgF2S"
        status: 'all',
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.NOT_FOUND);
      });

    response.count = response.data.length;

    if (response != undefined) {
      for (let i of response['data']) {
        const customer: any = await this.customersService.findCustomer(
          i.customer,
        );
        i['customer_name'] = customer ? customer.name : 'null';
      }
    }
    return response;
  }

  async findSubscription(id: string) {
    return await this.stripe.subscriptions.retrieve(id).catch((err) => {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    });
  }

  async createSubscription(subscriptionInfo: any, userId: any) {
    // **********CHECK CUSTOMER HAVE SUBSCRIPTION INVOICE OR NOT***********
    const invoice_list = await this.invoiceService.findStripeCustomerInvoice(
      subscriptionInfo.customer,
    );
    if (invoice_list.data.length) {
      // ************GET CUSTOMER CURRENT SUBSCRIPTION***********
      const subscription_result = await this.stripe.subscriptions.list({
        customer: subscriptionInfo.customer,
      });
      if (subscription_result.data.length) {
        for (let i of subscription_result['data']) {
          this.cancelSubscription(i.id);
        }
      }
      return await this.addSubscription(subscriptionInfo, userId);
    } else {
      /*Add 14 days subscription date as a trial end */
      subscriptionInfo.trial_end = moment().add(14, 'days').unix();
      return await this.addSubscription(subscriptionInfo, userId);
    }
  }

  async addSubscription(subscriptionInfo: any, userId) {
    const response = await this.stripe.subscriptions
      .create(subscriptionInfo)
      .catch((err) => {
        console.log(err)
        throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
      });

    const data: any = {
      subscriptionId: response.id,
      stripeObject: response.object,
      application_fee_percent: response.application_fee_percent,
      billing_cycle_anchor: response.billing_cycle_anchor,
      billing_thresholds: response.billing_thresholds,
      cancel_at: response.cancel_at,
      cancel_at_period_end: response.cancel_at_period_end,
      canceled_at: response.canceled_at,
      collection_method: response.collection_method,
      created: response.created,
      current_period_end: response.current_period_end,
      current_period_start: response.current_period_start,
      customer: response.customer,
      days_until_due: response.days_until_due,
      default_payment_method: response.default_payment_method,
      default_source: response.default_source,
      default_tax_rates: JSON.stringify(response.default_tax_rates),
      discount: response.discount,
      ended_at: response.ended_at,
      items: JSON.stringify(response.items),
      latest_invoice: response.latest_invoice,
      livemode: response.livemode,
      metadata: JSON.stringify(response.metadata),
      next_pending_invoice_item_invoice:
        response.next_pending_invoice_item_invoice,
      pause_collection: response.pause_collection,
      pending_invoice_item_interval: response.pending_invoice_item_interval,
      pending_setup_intent: response.pending_setup_intent,
      pending_update: response.pending_update,
      schedule: response.schedule,
      start_date: response.start_date,
      status: response.status,
      transfer_data: response.transfer_data,
      trial_end: response.trial_end,
      trial_start: response.trial_start,
      userId: userId,
      bought_click: parseInt(response['plan'].nickname),
    };
    this.subscriptionsRepository.save(data);

    const customerInfo = await this.customersService.findCustomer(
      subscriptionInfo.customer,
    );

    const subInfo = await this.stripe.subscriptions.retrieve(response.id);

    const mailData: any = {
      customer_name: customerInfo['name'],
      nickname: subInfo['plan'].nickname,
      interval: subInfo['plan'].interval,
      amount: subInfo['plan'].amount,
      currency: subInfo['plan'].currency.toUpperCase(),
      subject: 'Registerd Subscription Email',
      heading: 'Registerd Subscription',
      email: customerInfo['email'],
      billing_scheme: subInfo['plan'].billing_scheme,
      frontend_link: process.env.FRONTEND_URL,
      link: process.env.FRONTEND_URL,
      template: './create-subscription',
    };
    await this.emailService.sendEmail(mailData);
    return response;
  }

  async updateSubscription(id: string, subscriptionInfo: any) {
    const response = await this.stripe.subscriptions
      .update(id, subscriptionInfo)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.NOT_MODIFIED);
      });

    const data: any = {
      stripeObject: response.object,
      application_fee_percent: response.application_fee_percent,
      billing_cycle_anchor: response.billing_cycle_anchor,
      billing_thresholds: response.billing_thresholds,
      cancel_at: response.cancel_at,
      cancel_at_period_end: response.cancel_at_period_end,
      canceled_at: response.canceled_at,
      collection_method: response.collection_method,
      created: response.created,
      current_period_end: response.current_period_end,
      current_period_start: response.current_period_start,
      customer: response.customer,
      days_until_due: response.days_until_due,
      default_payment_method: response.default_payment_method,
      default_source: response.default_source,
      default_tax_rates: JSON.stringify(response.default_tax_rates),
      discount: response.discount,
      ended_at: response.ended_at,
      items: JSON.stringify(response.items),
      latest_invoice: response.latest_invoice,
      livemode: response.livemode,
      metadata: JSON.stringify(response.metadata),
      next_pending_invoice_item_invoice:
        response.next_pending_invoice_item_invoice,
      pause_collection: response.pause_collection,
      pending_invoice_item_interval: response.pending_invoice_item_interval,
      pending_setup_intent: response.pending_setup_intent,
      pending_update: response.pending_update,
      schedule: response.schedule,
      start_date: response.start_date,
      status: response.status,
      transfer_data: response.transfer_data,
      trial_end: response.trial_end,
      trial_start: response.trial_start,
      bought_click: parseInt(response['plan'].nickname),
    };
    return await this.subscriptionsRepository.update(
      { subscriptionId: id },
      data,
    );
  }

  async reactivateSubscription(id: string) {
    const findSubscription = await this.findSubscription(id);
    if (findSubscription) {
      const customerId: any = findSubscription.customer;
      const subscription_result = await this.stripe.subscriptions.list({
        customer: customerId,
      });
      if (subscription_result.data.length) {
        for (let i of subscription_result['data']) {
          if (i.id != id) {
            this.stripe.subscriptions
              .update(i.id, { cancel_at_period_end: true })
              .catch((err) => {
                throw new HttpException(err, HttpStatus.BAD_REQUEST);
              });
          }
        }
      }

      return await this.stripe.subscriptions
        .update(id, { cancel_at_period_end: false })
        .catch((err) => {
          throw new HttpException(err, HttpStatus.NOT_MODIFIED);
        });
    }
  }

  async cancelSubscription(id: string) {
    const findSubscription = await this.findSubscription(id);
    let cancel_at_period_end: boolean = false;
    if (findSubscription) {
      var end = moment
        .unix(findSubscription.current_period_end)
        .format('YYYY-MM-DD');
      var given = moment(end, 'YYYY-MM-DD');
      var current = moment().startOf('day');

      //Difference in number of days
      var diff = moment.duration(given.diff(current)).asDays();

      if (diff > 1) {
        return await this.stripe.subscriptions
          .update(id, { cancel_at_period_end: true })
          .catch((err) => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
          });
      } else {
        return await this.stripe.subscriptions.del(id).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        });
      }
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleNewSubscription() {
    const response = await this.stripe.subscriptions.list().catch((err) => {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    });

    if (response != undefined) {
      for (let i of response['data']) {
        const findSubscription = await this.subscriptionsRepository.findOne({
          where: { subscriptionId: i.id },
        });
        const bought_click =
          i['plan'] && i['plan'].nickname ? parseInt(i['plan'].nickname) : 0;
        if (!findSubscription) {
          const data: any = {
            subscriptionId: i.id,
            stripeObject: i.object,
            application_fee_percent: i.application_fee_percent,
            billing_cycle_anchor: i.billing_cycle_anchor,
            billing_thresholds: i.billing_thresholds,
            cancel_at: i.cancel_at,
            cancel_at_period_end: i.cancel_at_period_end,
            canceled_at: i.canceled_at,
            collection_method: i.collection_method,
            created: i.created,
            current_period_end: i.current_period_end,
            current_period_start: i.current_period_start,
            customer: i.customer,
            days_until_due: i.days_until_due,
            default_payment_method: i.default_payment_method,
            default_source: i.default_source,
            default_tax_rates: JSON.stringify(i.default_tax_rates),
            discount: i.discount,
            ended_at: i.ended_at,
            items: JSON.stringify(i.items),
            latest_invoice: i.latest_invoice,
            livemode: i.livemode,
            metadata: JSON.stringify(i.metadata),
            next_pending_invoice_item_invoice:
              i.next_pending_invoice_item_invoice,
            pause_collection: i.pause_collection,
            pending_invoice_item_interval: i.pending_invoice_item_interval,
            pending_setup_intent: i.pending_setup_intent,
            pending_update: i.pending_update,
            schedule: i.schedule,
            start_date: i.start_date,
            status: i.status,
            transfer_data: i.transfer_data,
            trial_end: i.trial_end,
            trial_start: i.trial_start,
            cron_add: true,
            bought_click: bought_click,
          };
          this.subscriptionsRepository.save(data);
        } else {
          const data: any = {
            stripeObject: i.object,
            application_fee_percent: i.application_fee_percent,
            billing_cycle_anchor: i.billing_cycle_anchor,
            billing_thresholds: i.billing_thresholds,
            cancel_at: i.cancel_at,
            cancel_at_period_end: i.cancel_at_period_end,
            canceled_at: i.canceled_at,
            collection_method: i.collection_method,
            created: i.created,
            current_period_end: i.current_period_end,
            current_period_start: i.current_period_start,
            customer: i.customer,
            days_until_due: i.days_until_due,
            default_payment_method: i.default_payment_method,
            default_source: i.default_source,
            default_tax_rates: JSON.stringify(i.default_tax_rates),
            discount: i.discount,
            ended_at: i.ended_at,
            items: JSON.stringify(i.items),
            latest_invoice: i.latest_invoice,
            livemode: i.livemode,
            metadata: JSON.stringify(i.metadata),
            next_pending_invoice_item_invoice:
              i.next_pending_invoice_item_invoice,
            pause_collection: i.pause_collection,
            pending_invoice_item_interval: i.pending_invoice_item_interval,
            pending_setup_intent: i.pending_setup_intent,
            pending_update: i.pending_update,
            schedule: i.schedule,
            start_date: i.start_date,
            status: i.status,
            transfer_data: i.transfer_data,
            trial_end: i.trial_end,
            trial_start: i.trial_start,
            cron_update: true,
            bought_click: bought_click,
          };
          this.subscriptionsRepository.update({ subscriptionId: i.id }, data);
        }
      }
    }
  }
  async stripeWebhook(body:any,signature:string) {
    let event=body;
    
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = this.stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(err)
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }
    const stripeObject = event.data.object;
    console.log(event.type)
    switch (event.type) {
      case 'checkout.session.completed':
            console.log("Here")
            if(stripeObject.client_reference_id){
              console.log(event)
              const user=await this.usersService.findOne(stripeObject.client_reference_id);
              
              await this.usersService.update(user,{customerId:stripeObject.customer})
              console.log(await this.usersService.findOne(stripeObject.client_reference_id))
            }
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    //response.send();
  }
}
