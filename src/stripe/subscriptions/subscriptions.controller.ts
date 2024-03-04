import {
  Controller,
  Get,
  Response,
  HttpStatus,
  Headers,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Public } from 'src/decorators/decorators';
import RequestWithRawBody from 'src/middleware/requestWithRawBody.interface';

@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly emailService: EmailService,
  ) {}

  @Get('email')
  sendMail(): any {
    //return this.emailService.example();
  }

  @Get('customer/:id')
  public async getCustomerSubscriptions(@Response() res, @Param() param) {
    const subscriptions =
      await this.subscriptionsService.findCustomerSubscription(param.id);
    return res.status(HttpStatus.OK).json(subscriptions);
  }

  @Get('customer/active/:id')
  public async getCustomerActiveSubscriptions(@Response() res, @Param() param) {
    const subscriptions =
      await this.subscriptionsService.findCustomerActiveSubscription(param.id);
    return res.status(HttpStatus.OK).json(subscriptions);
  }

  @Get('customer/latest/:id')
  public async getCustomerLatestSubscriptions(@Response() res, @Param() param) {
    const subscriptions =
      await this.subscriptionsService.findCustomerLatestSubscription(param.id);
    return res.status(HttpStatus.OK).json(subscriptions);
  }

  @Get()
  public async getSubscriptions(@Response() res) {
    const subscriptions = await this.subscriptionsService.findAllSubscription();
    return res.status(HttpStatus.OK).json(subscriptions);
  }

  @Get('/:id')
  public async getSubscription(@Response() res, @Param() param) {
    const subscription = await this.subscriptionsService.findSubscription(
      param.id,
    );
    return res.status(HttpStatus.OK).json(subscription);
  }

  @Post('create')
  public async createSubscription(
    @Response() res,
    @Request() req,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const subscriptions = await this.subscriptionsService.createSubscription(
      createSubscriptionDto,
      req.user.userId,
    );
    return res.status(HttpStatus.OK).json(subscriptions);
  }

  @Patch('/:id')
  public async updateSubscription(
    @Param() param,
    @Response() res,
    @Body() body,
  ) {
    const subscription = await this.subscriptionsService.updateSubscription(
      param.id,
      body,
    );
    return res.status(HttpStatus.OK).json(subscription);
  }

  @Get('/reactivate/:id')
  public async reactivateSubscription(@Param() param, @Response() res) {
    const subscription = await this.subscriptionsService.reactivateSubscription(
      param.id,
    );
    return res.status(HttpStatus.OK).json(subscription);
  }

  @Delete('/:id')
  public async cancelSubscription(@Param() param, @Response() res) {
    const subscription = await this.subscriptionsService.cancelSubscription(
      param.id,
    );
    return res.status(HttpStatus.OK).json(subscription);
  }

  
  @Post('stripe/webhook')
  @Public()
  public async stripeWebhook(
    @Response() res,
    @Headers('stripe-signature') signature: string,
    @Request() request: RequestWithRawBody
  ) {
    
    const subscriptions = await this.subscriptionsService.stripeWebhook(
      request.rawBody,
      signature
    );
    return res.status(HttpStatus.OK).json(subscriptions);
  }
}
