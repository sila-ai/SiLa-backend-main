import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdwordsService } from './adwords.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ads')
export class AdwordsController {
  constructor(private readonly AdwordsService: AdwordsService) {}
  @UseGuards(JwtAuthGuard)
  @Get('account')
  getAccount(@Req() req: Request) {
    return this.AdwordsService.getAccount(req);
  }
  @UseGuards(JwtAuthGuard)
  @Post('account')
  updateAccount(@Req() req: Request) {
    return this.AdwordsService.updateAccount(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('auth')
  adwordsLink(@Req() req: Request) {
    return this.AdwordsService.getAdwordLink(req);
  }
  @Get('token')
  getAdwordsRedrect(@Req() req: Request, @Res() res: Response) {
    return this.AdwordsService.getAdwordsRedrect(req, res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('token/auth')
  getAdwordsToken(@Req() req: Request) {
    return this.AdwordsService.getAdwordsToken(req);
  }
  @UseGuards(JwtAuthGuard)
  @Post('select')
  selectAccount(@Req() req: Request) {
    return this.AdwordsService.postSelectAccount(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('campaigns')
  getCampaigns(@Req() req: Request) {
    return this.AdwordsService.getCampaigns(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('campaigns/filter')
  filterCam(@Req() req: Request) {
    return this.AdwordsService.filterCampaigns(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('campaigns/test')
  test(@Req() req: Request) {
    return this.AdwordsService.test(req);
  }
}
