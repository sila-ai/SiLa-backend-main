import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Prices } from './prices.entity';
@Injectable()
export class PricesService {
    private readonly stripe: Stripe = stripe;

    constructor(
        @InjectRepository(Prices)
        private pricesRepository: Repository<Prices>,
    ) { }

    async findAllPrices() {
        return await this.stripe.prices.list().catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async findPrice(id: string) {
        return await this.stripe.prices.retrieve(id).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async createPrice(priceInfo: any) {
        return await this.stripe.prices.create({
            unit_amount: priceInfo.unit_amount,
            currency: priceInfo.currency,
            product: priceInfo.product,
            nickname: priceInfo.nickname,
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        })
    }

    async updatePrice(id: string, priceInfo: any) {
        return await this.stripe.prices.update(id, priceInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_MODIFIED)
        })
    }
}
