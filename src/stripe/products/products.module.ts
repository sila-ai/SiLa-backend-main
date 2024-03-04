import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { Products } from './products.entity';
import { ProductsService } from './products.service';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [TypeOrmModule.forFeature([Products]), ScheduleModule.forRoot()],
  providers: [ProductsService],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
