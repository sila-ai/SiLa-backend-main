import { Controller, Post, Req, Get, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('list')
  getUrlList(@Req() req: Request): any {
    return this.urlService.getUrlList(req);
  }

  @Post('create')
  urlMake(@Req() req: Request): any {
    return this.urlService.postUrl(req);
  }

  @Post('update')
  urlUp(@Req() req: Request): any {
    return this.urlService.updateUrl(req);
  }

  @Post('delete')
  delUrl(@Req() req: Request): any {
    return this.urlService.deleteUrl(req);
  }

  @Get('get')
  getUrl(@Req() req: Request): any {
    return this.urlService.getUrl(req);
  }
  @Get('rule')
  getRule(@Req() req: Request): any {
    return this.urlService.getRule(req);
  }
  @Post('rule')
  postUrlRule(@Req() req: Request): any {
    return this.urlService.posturlRule(req);
  }
}
