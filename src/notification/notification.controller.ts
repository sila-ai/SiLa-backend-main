import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notificaiton.service';
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificaitonService: NotificationService) {}

  @Get('')
  public async getNotificationController(@Request() req) {
    return this.notificaitonService.getNotifications(req);
  }
}
