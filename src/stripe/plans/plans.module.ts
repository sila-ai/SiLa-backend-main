import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansController } from './plans.controller';
import { Plans } from './plans.entity';
import { PlansService } from './plans.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsModule } from '../products/products.module';
@Module({
  imports: [TypeOrmModule.forFeature([Plans]), ScheduleModule.forRoot(), ProductsModule],
  providers: [PlansService],
  exports: [PlansService],
  controllers: [PlansController],
})
export class PlansModule {}
