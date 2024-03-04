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
import { CreatePlanDto } from './dto/createPlan.dto';
import { EditPlanDto } from './dto/editPlan.dto';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  public async getPlans(@Response() res) {
    const plans = await this.plansService.findAllPlans();
    return res.status(HttpStatus.OK).json(plans);
  }

  @Get('/:id')
  public async getPlan(@Response() res, @Param() param) {
    const plan = await this.plansService.findPlan(param.id);
    return res.status(HttpStatus.OK).json(plan);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async createPlan(
    @Response() res,
    @Body() createPlanDto: CreatePlanDto,
  ) {
    const plans = await this.plansService.createPlan(createPlanDto);
    return res.status(HttpStatus.OK).json(plans);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async updatePlan(
    @Param() param,
    @Response() res,
    @Body() body: EditPlanDto,
  ) {
    const plan = await this.plansService.updatePlan(param.id, body);
    return res.status(HttpStatus.OK).json(plan);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  public async deletePlan(@Param() param, @Response() res) {
    const confirmation = await this.plansService.deletePlan(param.id);
    return res.status(HttpStatus.OK).json(confirmation);
  }
}
