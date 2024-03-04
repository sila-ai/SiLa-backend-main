import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from './customers.entity';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [TypeOrmModule.forFeature([Customers]), ScheduleModule.forRoot()],
  providers: [CustomersService],
  exports: [CustomersService],
  controllers: [CustomersController],
})
export class CustomersModule {}
