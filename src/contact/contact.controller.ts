import { Controller, Get, Post, Delete, Body, Param, Patch, Response, HttpStatus } from '@nestjs/common';
import { ContactDto } from './contact.dto';
import { Contact } from './contact.entity';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {
  }

  @Post()
  public async create(@Response() res, @Body() contact: ContactDto): Promise<any> {
    const response = await this.contactService.create(contact);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get(':id')
  public async get(@Response() res, @Param() param: any): Promise<Contact> {
    const response = await this.contactService.findOne(param.id);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get()
  public async getAll(@Response() res) {
    const response = await this.contactService.findAll();
    return res.status(HttpStatus.OK).json(response);
  }

  @Patch(':id')
  public async update(@Response() res, @Param() param: any, @Body() body: ContactDto): Promise<any> {
    const user = await this.contactService.findOne(param.id);
    const response = await this.contactService.update(user, body);
    return res.status(HttpStatus.OK).json(response);
  }

  @Delete(':id')
  public async delete(@Response() res, @Param() param: any): Promise<any> {
    const response = await this.contactService.delete(param.id);
    return res.status(HttpStatus.OK).json(response);
  }
}
