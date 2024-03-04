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
import { CreatePriceDto } from './dto/createPrice.dto';
import { EditPriceDto } from './dto/editPrice.dto';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
    
    constructor(private readonly pricesService: PricesService) {}
    
    @Get()
    public async getPrices(@Response() res) {
        const prices = await this.pricesService.findAllPrices();
        return res.status(HttpStatus.OK).json(prices);
    }

    @Get('/:id')
    public async getPrice(@Response() res, @Param() param) {
        const price = await this.pricesService.findPrice(param.id);
        return res.status(HttpStatus.OK).json(price);
    }

    @Post()
    public async createPrice(
        @Response() res,
        @Body() createPriceDto: CreatePriceDto,
        ) {
        const prices = await this.pricesService.createPrice(
            createPriceDto,
        );
        return res.status(HttpStatus.OK).json(prices);
    }

    @Patch('/:id')
    public async updatePrice(@Param() param, @Response() res, @Body() body: EditPriceDto) {
        const price = await this.pricesService.updatePrice(param.id, body);
        return res.status(HttpStatus.OK).json(price);
    }
}
