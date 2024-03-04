import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {

    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>
    ) { }

    async create(contact: Contact) {
        let today =  new Date().toISOString().slice(0, 10);
        contact.createDateTime = today;
        return await this.contactRepository.save(contact).catch(error => {
            throw new HttpException(error, HttpStatus.NOT_ACCEPTABLE);
        });
    }

    async findOne(id: number) {
        return await this.contactRepository.findOne(id).catch(error => {
            throw new HttpException(error, HttpStatus.NOT_FOUND);
        });
    }

    async findAll(): Promise<Contact[]> {
        return await this.contactRepository.find().catch(error => {
            throw new HttpException(error, HttpStatus.NOT_FOUND);
        })
    }

    async update(contact: Contact, data: any): Promise<UpdateResult> {
        return await this.contactRepository.update(contact, data).catch(error => {
            throw new HttpException(error, HttpStatus.NOT_MODIFIED);
        });
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.contactRepository.delete(id).catch(error => {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        });
    }
}
