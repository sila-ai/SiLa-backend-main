import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesController } from './prices.controller';
import { Prices } from './prices.entity';
import { PricesService } from './prices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prices])],
  providers: [PricesService],
  exports: [PricesService],
  controllers: [PricesController],
})
export class PricesModule {}
