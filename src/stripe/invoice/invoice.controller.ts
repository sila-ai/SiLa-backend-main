import { 
    Controller,
    Get,
    Response,
    HttpStatus,
    Param,
    Body,
    Post,
    Patch,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(
        private readonly invoiceService: InvoiceService,
    ) {}

    @Post('create')
    public async createInvoice(
        @Response() res,
        @Body() createInvoiceDto: CreateInvoiceDto,
        ) {
        const result = await this.invoiceService.create(
            createInvoiceDto,
        );
        
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('/:invoiceId/')
    public async findInvoice(@Response() res, @Param() param) {
        const response = await this.invoiceService.findOne(param.invoiceId);
        return res.status(HttpStatus.OK).json(response);
    }

    @Get('/customer/:customerId/')
    public async getCustomerInvoice(@Response() res, @Param() param) {
        const response = await this.invoiceService.findCustomerInvoice(param.customerId);
        return res.status(HttpStatus.OK).json(response);
    }

    @Patch('/:id')
    public async updateInvoice(@Param() param, @Response() res, @Body() body) {
        const response = await this.invoiceService.updateInvoice(param.id, body);
        return res.status(HttpStatus.OK).json(response);
    }
}
