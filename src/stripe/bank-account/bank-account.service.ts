import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import { BankTokenResponse } from './interfaces/bank-token-response.interface';

@Injectable()
export class BankAccountService {
  private readonly stripe: Stripe = stripe;

  async createBankAccount(id: string, bankInfo: any) {
    return await this.stripe.customers.createSource(id, bankInfo).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    })
  }

  async findBankAccount(customerId: string, bankAccountId: string) {
    return await this.stripe.customers.retrieveSource(customerId, bankAccountId).catch(err => {
      throw new HttpException(err, HttpStatus.NOT_FOUND)
    })
  }

  async findAllBankAccount(customerId: string, bankInfo: any) {
    return await this.stripe.customers.listSources(customerId, bankInfo).catch(err => {
      throw new HttpException(err, HttpStatus.NOT_FOUND)
    })
  }

  async updateBankAccount(customerId: string, bankAccountId: string, bankInfo: any) {
    return await this.stripe.customers.updateSource(customerId, bankAccountId, bankInfo).catch(err => {
      throw new HttpException(err, HttpStatus.NOT_MODIFIED)
    })
  }

  async verifyBankAccount(customerId: string, bankAccountId: string, bankInfo: any) {
    return await this.stripe.customers.verifySource(customerId, bankAccountId, bankInfo).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    })
  }

  async deleteBankAccount(customerId: string, bankAccountId: string) {
    return await this.stripe.customers.deleteSource(customerId, bankAccountId).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    })
  }

  // async generateToken(tokenInfo: any) {
  //   return await this.stripe.tokens.create(tokenInfo).catch(err => {
  //     throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
  //   })
  // }
}
