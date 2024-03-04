import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../stripe';
import { Products } from './products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
@Injectable()
export class ProductsService {
    private readonly stripe: Stripe = stripe;

    constructor(
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
        private schedulerRegistry: SchedulerRegistry,
    ) { }

    async findAllProducts() {
        return await this.stripe.products.list().catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async findProduct(id: string) {
        return await this.stripe.products.retrieve(id).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        })
    }

    async createProduct(productInfo: any) {
        const response = await this.stripe.products.create(productInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE)
        })
        const data: any = {
            productId: response.id,
            stripeObject: response.object,
            active: response.active,
            attributes: JSON.stringify(response.attributes),
            created: response.created,
            description: response.description,
            images: JSON.stringify(response.images),
            livemode: response.livemode,
            metadata: JSON.stringify(response.metadata),
            name: response.name,
            package_dimensions: response.package_dimensions,
            shippable: response.shippable,
            statement_descriptor: response.statement_descriptor,
            type: response.type,
            unit_label: response.unit_label,
            updated: response.updated,
            url: response.url
        }
        return await this.productsRepository.save(data);
    }

    async updateProduct(id: string, productInfo: any) {
        const response = await this.stripe.products.update(id, productInfo).catch(err => {
            throw new HttpException(err, HttpStatus.NOT_MODIFIED)
        })

        const data: any = {
            stripeObject: response.object,
            active: response.active,
            attributes: JSON.stringify(response.attributes),
            created: response.created,
            description: response.description,
            images: JSON.stringify(response.images),
            livemode: response.livemode,
            metadata: JSON.stringify(response.metadata),
            name: response.name,
            package_dimensions: response.package_dimensions,
            shippable: response.shippable,
            statement_descriptor: response.statement_descriptor,
            type: response.type,
            unit_label: response.unit_label,
            updated: response.updated,
            url: response.url
        }

        return await this.productsRepository.update({"productId": id},data);
    }

    async deleteProduct(id: string) {
        return await this.stripe.products.del(id).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        })
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async handleNewProduct() {

    const response = await this.stripe.products.list().catch(err => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST)
    })

    if (response != undefined) {
      for ( let i of response['data']){
        const findProduct = await this.productsRepository.findOne({where: {productId: i.id}});
        if(!findProduct){
            const data: any = {
                productId: i.id,
                stripeObject: i.object,
                active: i.active,
                attributes: JSON.stringify(i.attributes),
                created: i.created,
                description: i.description,
                images: JSON.stringify(i.images),
                livemode: i.livemode,
                metadata: JSON.stringify(i.metadata),
                name: i.name,
                package_dimensions: i.package_dimensions,
                shippable: i.shippable,
                statement_descriptor: i.statement_descriptor,
                type: i.type,
                unit_label: i.unit_label,
                updated: i.updated,
                url: i.url,
                cron_add: true
            }
          this.productsRepository.save(data);
        }else{
            const data: any = {
                stripeObject: i.object,
                active: i.active,
                attributes: JSON.stringify(i.attributes),
                created: i.created,
                description: i.description,
                images: JSON.stringify(i.images),
                livemode: i.livemode,
                metadata: JSON.stringify(i.metadata),
                name: i.name,
                package_dimensions: i.package_dimensions,
                shippable: i.shippable,
                statement_descriptor: i.statement_descriptor,
                type: i.type,
                unit_label: i.unit_label,
                updated: i.updated,
                url: i.url,
                cron_update: true
            }
            this.productsRepository.update({"productId": i.id},data);
        }
      }
    }
  }
}
