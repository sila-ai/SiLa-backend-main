import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { CustomersModule } from '../customers/customers.module';
@Module({
  imports: [ScheduleModule.forRoot(),CustomersModule],
  providers: [InvoiceService],
  exports: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
