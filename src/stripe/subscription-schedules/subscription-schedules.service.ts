import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionSchedules } from './subscription-schedules.entity';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';
import * as dotenv from 'dotenv';
dotenv.config()

@Injectable()
export class SubscriptionSchedulesService {
    private readonly stripe: Stripe = stripe;

    constructor(
        @InjectRepository(SubscriptionSchedules)
        private subscriptionSchedulesRepository: Repository<SubscriptionSchedules>,
        private readonly emailService: EmailService,
        private schedulerRegistry: SchedulerRegistry,
    ) { }

    async findAllSubscriptionSchedules(){
        return await this.stripe.subscriptionSchedules.list({limit: 3}).catch(err => {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        })
    }

    async findSubscriptionSchedule(id: string) {
        return await this.stripe.subscriptionSchedules.retrieve(id).catch(err => {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        })
    }

    async createSubscriptionSchedules(subscriptionScheduleInfo: any ) {

        let planId = "";
        for(let i of subscriptionScheduleInfo['phases']){
            for(let j of i['items']){
                planId = j['price'];
            }
            
        }
        const response = await this.stripe.subscriptionSchedules.create(subscriptionScheduleInfo).catch(err => {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        })

        const data: any = {
            subcriptionSchedulesId: response.id,
            stripeObject: response.object,
            canceled_at: response.canceled_at,
            completed_at: response.completed_at,
            created: response.created,
            current_phase: response.current_phase,
            customer: response.customer,
            default_settings: JSON.stringify(response.default_settings),
            end_behavior: response.end_behavior,
            livemode: response.livemode,
            metadata: JSON.stringify(response.metadata),
            phases: JSON.stringify(response.phases),
            released_at: response.released_at,
            released_subscription: response.released_subscription,
            status: response.status,
            subscription: response.subscription
        }
        this.subscriptionSchedulesRepository.save(data);

        const customerInfo = await this.stripe.customers.retrieve(subscriptionScheduleInfo.customer);

        const planInfo = await this.stripe.plans.retrieve(planId);

        const message = "Hello " +customerInfo['name']+ ",<br>Thank you for subscribing for our plan <b>`"+planInfo['nickname']+"`</b> on " +planInfo['interval']+"ly basis. We've deducted <b>`"+planInfo.currency.toUpperCase()+ " " +planInfo['amount']+ "`</b> for this " +planInfo['interval']+ " and from next " +planInfo['interval']+ " same date it will get auto deducted from your provided payment method. <br> For any change in the plan or cancellation kindly login to our panel using this <a href='"+process.env.STRIPE_API_KEY+"'>Click Here</a>";
        
        const mailData: any = {
            "customer_name": customerInfo['name'],
            "subject": "Registerd Subscription Schedule Email",
            "email": "varsha.goutam@hiteshi.com",
            "billing_scheme": planInfo['billing_scheme'],
            "message": message,
        }
        await this.emailService.sendEmail(mailData); 
        return response;
    }

    async updateSubscriptionSchedule(id: string, subscriptionScheduleInfo: any) {
        const response = await this.stripe.subscriptionSchedules.update(id, subscriptionScheduleInfo).catch(err => {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        })
        const data: any = {
            stripeObject: response.object,
            canceled_at: response.canceled_at,
            completed_at: response.completed_at,
            created: response.created,
            current_phase: response.current_phase,
            customer: response.customer,
            default_settings: JSON.stringify(response.default_settings),
            end_behavior: response.end_behavior,
            livemode: response.livemode,
            metadata: JSON.stringify(response.metadata),
            phases: JSON.stringify(response.phases),
            released_at: response.released_at,
            released_subscription: response.released_subscription,
            status: response.status,
            subscription: response.subscription
        }
        return await this.subscriptionSchedulesRepository.update({"subcriptionSchedulesId": id},data);
    }

    async cancelSubscriptionSchedule(id: string) {
        const response = await this.stripe.subscriptionSchedules.cancel(id).catch(err => {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        })
        const data: any = {
            status: response.status,
            canceled_at: response.canceled_at
        }
        return await this.subscriptionSchedulesRepository.update({"subcriptionSchedulesId": id},data);
    }

    async releaseSubscriptionSchedule(id: string) {
        const response = await this.stripe.subscriptionSchedules.release(id).catch(err => {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        })

        const data: any = {
            status: response.status,
            released_at: response.released_at,
            released_subscription: response.released_subscription
        }
        return await this.subscriptionSchedulesRepository.update({"subcriptionSchedulesId": id},data);
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleNewSubscriptionSchedule() {
  
        const response = await this.stripe.subscriptionSchedules.list().catch(err => {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        })
    
        if (response != undefined) {
            for ( let i of response['data']){
                const findSubscriptionSchedule = await this.subscriptionSchedulesRepository.findOne({where: {subcriptionSchedulesId: i.id}});
                if(!findSubscriptionSchedule){
                    const data: any = {
                        subcriptionSchedulesId: i.id,
                        stripeObject: i.object,
                        canceled_at: i.canceled_at,
                        completed_at: i.completed_at,
                        created: i.created,
                        current_phase: i.current_phase,
                        customer: i.customer,
                        default_settings: JSON.stringify(i.default_settings),
                        end_behavior: i.end_behavior,
                        livemode: i.livemode,
                        metadata: JSON.stringify(i.metadata),
                        phases: JSON.stringify(i.phases),
                        released_at: i.released_at,
                        released_subscription: i.released_subscription,
                        status: i.status,
                        subscription: i.subscription,
                        cron_add: true
                    }
                    return await this.subscriptionSchedulesRepository.save(data);
                }else{
                    const data: any = {
                        stripeObject: i.object,
                        canceled_at: i.canceled_at,
                        completed_at: i.completed_at,
                        created: i.created,
                        current_phase: i.current_phase,
                        customer: i.customer,
                        default_settings: JSON.stringify(i.default_settings),
                        end_behavior: i.end_behavior,
                        livemode: i.livemode,
                        metadata: JSON.stringify(i.metadata),
                        phases: JSON.stringify(i.phases),
                        released_at: i.released_at,
                        released_subscription: i.released_subscription,
                        status: i.status,
                        subscription: i.subscription,
                        cron_update: true
                    }
                    this.subscriptionSchedulesRepository.update({"subcriptionSchedulesId": i.id},data);
                }
            }
        }
    }
}
