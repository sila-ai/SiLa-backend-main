import {
  Controller,
  Get,
  Response,
  HttpStatus,
  Param,
  Body,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/createCustomer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  public async getCustomers(@Response() res) {
    const customers = await this.customersService.findAllCustomers();
    return res.status(HttpStatus.OK).json(customers);
  }

  @Get('/:id')
  public async getCustomer(@Response() res, @Param() param) {
    const customer = await this.customersService.findCustomer(param.id);
    return res.status(HttpStatus.OK).json(customer);
  }

  @Get('/get-customer-stripe-id/:id')
  public async getCustomerStripeId(@Response() res, @Param() param) {
    const customer = await this.customersService.findStripeCustomerId(param.id);
    return res.status(HttpStatus.OK).json(customer);
  }

  @Post()
  public async createCustomer(
    @Response() res,
    @Body() createCustomerDTO: CreateCustomerDto,
  ) {
    const customer = await this.customersService.createCustomer(
      createCustomerDTO,
    );
    return res.status(HttpStatus.OK).json(customer);
  }

  @Patch('/:id')
  public async updateCustomer(@Param() param, @Response() res, @Body() body) {
    const customer = await this.customersService.updateCustomer(param.id, body);
    return res.status(HttpStatus.OK).json(customer);
  }

  @Delete('/:id')
  public async deleteCustomer(@Param() param, @Response() res){
    const confirmation = await this.customersService.deleteCustomer(param.id);
    return res.status(HttpStatus.OK).json(confirmation);
  }

  @Post('/generate-token')
    public async generateToken(@Response() res, @Body() body) {
      const tokens = await this.customersService.generateToken(
          body,
      );
      return res.status(HttpStatus.OK).json(tokens);
    }
}
