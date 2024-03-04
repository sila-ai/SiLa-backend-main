import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('script')
  getAnalyticData(@Req() req: Request): any {
    return this.analyticsService.getAnalyticScript(req);
  }

  @Get()
  getredirectraffic(@Req() req: Request): any {
    return this.analyticsService.getAnalyticsData(req);
  }

  @Post()
  postTrafficData(@Req() req: Request) {
    return this.analyticsService.postAnalyticsData(req);
  }
}
