import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}
  @UseGuards(JwtAuthGuard)
  @Get('user')
  getTrafficData(@Req() req: Request) {
    return this.trafficService.filterTraffic(req);
  }

  @Get('test')
  blockByGoogle(@Req() req: Request) {
    return this.trafficService.testTraffic(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('clicks')
  getAllLeftCliks(@Req() req: Request): any {
    return this.trafficService.getLeftClicks(req);
  }

  @Get(':id/')
  getredirectraffic(@Req() req: Request): any {
    return this.trafficService.getTraffic(req);
  }
}
