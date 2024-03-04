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
    UseGuards,
} from '@nestjs/common';
import { CardTokenResponse } from './interfaces/card-token-response.interface';
import { CardService } from './card.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('card')
export class CardController {
    constructor(private readonly cardService: CardService) { }

    @Post('/:id')
    public async createCard(@Param() param, @Response() res, @Body() body) {
        const response = await this.cardService.create(param.id, body);
        return res.status(HttpStatus.OK).json(response);
    }

    @Get('/:customerId/:cardId')
    public async getCard(@Response() res, @Param() param) {
        const response = await this.cardService.findOne(param.customerId, param.cardId);
        return res.status(HttpStatus.OK).json(response);
    }

    @Post('/:customerId')
    public async getAllCard(@Response() res, @Param() param, @Body() body) {
        const response = await this.cardService.findAll(param.customerId, body);
        return res.status(HttpStatus.OK).json(response);
    }

    @Patch('/:customerId/:cardId')
    public async updateCard(@Response() res, @Param() param, @Body() body) {
        const response = await this.cardService.update(param.customerId, param.cardId, body);
        return res.status(HttpStatus.OK).json(response);
    }

    @Delete('/:customerId/:cardId')
    public async deleteCard(@Param() param: { customerId: string, cardId: string }) {
        const response = await this.cardService.delete(param.customerId, param.cardId);
        return { status: true, response: response }
    }

    // @Post('generate-token')
    // public async generateToken(@Response() res, @Body() body) {
    //     const tokens: CardTokenResponse = await this.cardService.generateToken(body);
    //     return res.status(HttpStatus.OK).json(tokens);
    // }
    
}
