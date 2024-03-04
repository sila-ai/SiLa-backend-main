import { Injectable } from '@nestjs/common';
import { Notification } from './notificaiton.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}
  async getNotifications(req) {
    const userId = req.user.userId;
    const notificaiton = await this.notificationRepository.find({
      where: { userId: userId },
      take: 5,
      order: {
        id: 'DESC',
      },
    });
    return notificaiton;
  }
}
