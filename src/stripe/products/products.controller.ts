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
    UseGuards
} from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    public async getProducts(@Response() res) {
        const products = await this.productsService.findAllProducts();
        return res.status(HttpStatus.OK).json(products);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    public async getProduct(@Response() res, @Param() param) {
        const product = await this.productsService.findProduct(param.id);
        return res.status(HttpStatus.OK).json(product);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    public async createProduct(
        @Response() res,
        @Body() createProductDto: CreateProductDto,
    ) {
        const products = await this.productsService.createProduct(
            createProductDto,
        );
        return res.status(HttpStatus.OK).json(products);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/:id')
    public async updateProduct(@Param() param, @Response() res, @Body() body: CreateProductDto) {
        const product = await this.productsService.updateProduct(param.id, body);
        return res.status(HttpStatus.OK).json(product);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    public async deleteProduct(@Param() param, @Response() res) {
        const confirmation = await this.productsService.deleteProduct(param.id);
        return res.status(HttpStatus.OK).json(confirmation);
    }
}
