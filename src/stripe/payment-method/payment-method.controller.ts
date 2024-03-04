import {
    Controller,
    Get,
    Response,
    Request,
    HttpStatus,
    Param,
    Body,
    Post,
    Patch,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePaymentMethodDto } from './dto/createPaymentMethod.dto';
import { UpdatePaymentMethodDto } from './dto/updatePaymentMethod.dto';
import { PaymentMethodService } from './payment-method.service';

@UseGuards(JwtAuthGuard)
@Controller('payment-method')
export class PaymentMethodController {
    constructor(private readonly paymentMethodService: PaymentMethodService) { }

    @Post()
    public async getPaymentMethods(@Response() res, @Body() body) {
        const paymentMethods = await this.paymentMethodService.findAllPaymentMethods(body);
        return res.status(HttpStatus.OK).json(paymentMethods);
    }

    @Get('/:id')
    public async getPaymentMethod(@Response() res, @Param() param) {
        const paymentMethod = await this.paymentMethodService.findPaymentMethod(param.id);
        return res.status(HttpStatus.OK).json(paymentMethod);
    }

    @Post('create')
    public async createPaymentMethod(
        @Response() res, @Request() req: any,
        @Body() createPaymentMethodDto: CreatePaymentMethodDto,
    ) {
        const paymentMethods = await this.paymentMethodService.createPaymentMethod(
            createPaymentMethodDto, req.user.customerId
        );
        console.log(paymentMethods)
        return res.status(HttpStatus.OK).json(paymentMethods);
    }

    @Patch('/:id')
    public async updatePaymentMethod(@Param() param, @Response() res, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
        const paymentMethod = await this.paymentMethodService.updatePaymentMethod(param.id, updatePaymentMethodDto);
        return res.status(HttpStatus.OK).json(paymentMethod);
    }

    @Post('/:id/attach')
    public async attachPaymentMethod(@Param() param, @Response() res, @Body() body) {
        const paymentMethod = await this.paymentMethodService.attachPaymentMethod(param.id, body);
        return res.status(HttpStatus.OK).json(paymentMethod);
    }

    @Post('/:id/detach')
    public async detachPaymentMethod(@Param() param, @Response() res) {
        const confirmation = await this.paymentMethodService.detachPaymentMethod(param.id);
        return res.status(HttpStatus.OK).json(confirmation);
    }
}
