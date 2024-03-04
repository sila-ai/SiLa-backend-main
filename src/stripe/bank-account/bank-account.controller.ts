import {
    Controller,
    Get,
    Response,
    HttpStatus,
    Param,
    Body,
    Post,
    Request,
    Patch,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BankAccountService } from './bank-account.service';
import { BankTokenResponse } from './interfaces/bank-token-response.interface';

@UseGuards(JwtAuthGuard)
@Controller('bank-account')

export class BankAccountController {
    constructor(private readonly bankAccountService: BankAccountService) { }

    @Post('/:id')
    public async createBankAccount(@Param() param, @Response() res, @Body() body) {
        const response = await this.bankAccountService.createBankAccount(param.id, body);
        return res.status(HttpStatus.OK).json(response);
    }

    @Get('/:customerId/:bankAccountId')
    public async getBankAccount(@Response() res, @Param() param) {
        const response = await this.bankAccountService.findBankAccount(param.customerId, param.bankAccountId);
        return res.status(HttpStatus.OK).json(response);
    }

    @Post('/:customerId')
    public async getAllBankAccount(@Response() res, @Param() param, @Body() body) {
        const response = await this.bankAccountService.findAllBankAccount(param.customerId, body);
        return res.status(HttpStatus.OK).json(response);
    }

    @Patch('/:customerId/:bankAccountId')
    public async updateBankAccount(@Response() res, @Param() param, @Body() body) {
        const response = await this.bankAccountService.updateBankAccount(param.customerId, param.bankAccountId, body);
        return res.status(HttpStatus.OK).json(response);
    }

    @Post('/:customerId/:bankAccountId/verify')
    public async verifyBankAccount(@Response() res, @Param() param, @Body() body) {
        const response = await this.bankAccountService.verifyBankAccount(param.customerId, param.bankAccountId, body);
        return res.status(HttpStatus.OK).json(response);
    }

    @Delete('/:customerId/:bankAccountId')
    public async deleteBankAccount(@Response() res, @Param() param) {
        const response = await this.bankAccountService.deleteBankAccount(param.customerId, param.bankAccountId);
        return res.status(HttpStatus.OK).json(response);
    }

    // @Post('/generate-token')
    // public async generateToken(@Response() res, @Body() body) {
    //     const tokens = await this.bankAccountService.generateToken(
    //         body,
    //     );
    //     return res.status(HttpStatus.OK).json(tokens);
    // }
}
