import { Module } from '@nestjs/common';
import { BankAccountController } from './bank-account.controller';
import { BankAccountService } from './bank-account.service';
@Module({
  imports: [],
  providers: [BankAccountService],
  exports: [BankAccountService],
  controllers: [BankAccountController],
})
export class BankAccountModule {}
