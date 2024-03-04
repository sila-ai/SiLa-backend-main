import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CardTokenResponse } from './interfaces/card-token-response.interface';
import { stripe } from '../stripe';

@Injectable()
export class CardService {
    private readonly stripe: Stripe = stripe;

    async create(id: string, cardInfo: any) {
        return await this.stripe.customers.createSource(id, cardInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE)
        })
    }

    async findOne(customerId: string, cardId: string) {
        return await this.stripe.customers.retrieveSource(customerId, cardId).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async findAll(customerId: string, cardInfo: any) {
        return await this.stripe.customers.listSources(customerId, cardInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async update(customerId: string, cardId: string, cardInfo: any) {
        return await this.stripe.customers.updateSource(customerId, cardId, cardInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_MODIFIED)
        })
    }

    async delete(customerId: string, cardId: string) {
        return await this.stripe.customers.deleteSource(customerId, cardId).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        })
    }

    async generateToken(card: any): Promise<CardTokenResponse> {
        return await this.stripe.tokens.create(card).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        })
    }
}
