import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from './plans.entity';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ProductsService } from '../products/products.service';
@Injectable()
export class PlansService {
  private readonly stripe: Stripe = stripe;

  constructor(
    @InjectRepository(Plans)
    private plansRepository: Repository<Plans>,
    private schedulerRegistry: SchedulerRegistry,
    private productsService: ProductsService,
  ) {}

  async findAllPlans() {
    const response: any = await this.stripe.plans.list().catch((err) => {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    });

    response.count = response.data.length;

    if (response != undefined) {
      for (let i of response['data']) {
        const product = await this.productsService.findProduct(i.product);
        i['product_name'] = product ? product.name : 'null';
      }
    }
    return response;
  }

  async findPlan(id: string) {
    return await this.stripe.plans.retrieve(id).catch((err) => {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    });
  }

  async createPlan(planInfo: any) {
    //save clicks in nickname field
    const response = await this.stripe.plans.create(planInfo).catch((err) => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });

    const data: any = {
      planId: response.id,
      stripeObject: response.object,
      active: response.active,
      aggregate_usage: response.aggregate_usage,
      amount: response.amount,
      amount_decimal: response.amount_decimal,
      billing_scheme: response.billing_scheme,
      created: response.created,
      currency: response.currency,
      interval: response.interval,
      interval_count: response.interval_count,
      livemode: response.livemode,
      metadata: JSON.stringify(response.metadata),
      nickname: response.nickname,
      product: response.product,
      tiers_mode: response.tiers_mode,
      transform_usage: response.transform_usage,
      trial_period_days: response.trial_period_days,
      usage_type: response.usage_type,
    };
    return await this.plansRepository.save(data);
  }

  async updatePlan(id: string, planInfo: any) {
    const response = await this.stripe.plans
      .update(id, planInfo)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.NOT_MODIFIED);
      });

    const data: any = {
      stripeObject: response.object,
      active: response.active,
      aggregate_usage: response.aggregate_usage,
      amount: response.amount,
      amount_decimal: response.amount_decimal,
      billing_scheme: response.billing_scheme,
      created: response.created,
      currency: response.currency,
      interval: response.interval,
      interval_count: response.interval_count,
      livemode: response.livemode,
      metadata: JSON.stringify(response.metadata),
      nickname: response.nickname,
      product: response.product,
      tiers_mode: response.tiers_mode,
      transform_usage: response.transform_usage,
      trial_period_days: response.trial_period_days,
      usage_type: response.usage_type,
    };
    return await this.plansRepository.update({ planId: id }, data);
  }

  async deletePlan(id: string) {
    return await this.stripe.plans.del(id).catch((err) => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleNewPlans() {
    const response = await this.stripe.plans.list().catch((err) => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });

    if (response != undefined) {
      for (let i of response['data']) {
        const findProduct = await this.plansRepository.findOne({
          where: { planId: i.id },
        });
        if (!findProduct) {
          const data: any = {
            planId: i.id,
            stripeObject: i.object,
            active: i.active,
            aggregate_usage: i.aggregate_usage,
            amount: i.amount,
            amount_decimal: i.amount_decimal,
            billing_scheme: i.billing_scheme,
            created: i.created,
            currency: i.currency,
            interval: i.interval,
            interval_count: i.interval_count,
            livemode: i.livemode,
            metadata: JSON.stringify(i.metadata),
            nickname: i.nickname,
            product: i.product,
            tiers_mode: i.tiers_mode,
            transform_usage: i.transform_usage,
            trial_period_days: i.trial_period_days,
            usage_type: i.usage_type,
            cron_add: true,
          };
          this.plansRepository.save(data);
        } else {
          const data: any = {
            stripeObject: i.object,
            active: i.active,
            aggregate_usage: i.aggregate_usage,
            amount: i.amount,
            amount_decimal: i.amount_decimal,
            billing_scheme: i.billing_scheme,
            created: i.created,
            currency: i.currency,
            interval: i.interval,
            interval_count: i.interval_count,
            livemode: i.livemode,
            metadata: JSON.stringify(i.metadata),
            nickname: i.nickname,
            product: i.product,
            tiers_mode: i.tiers_mode,
            transform_usage: i.transform_usage,
            trial_period_days: i.trial_period_days,
            usage_type: i.usage_type,
            cron_update: true,
          };
          this.plansRepository.update({ planId: i.id }, data);
        }
      }
    }
  }
}
