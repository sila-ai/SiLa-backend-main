import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionSchedulesController } from './subscription-schedules.controller';

describe('SubscriptionSchedulesController', () => {
  let controller: SubscriptionSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionSchedulesController],
    }).compile();

    controller = module.get<SubscriptionSchedulesController>(SubscriptionSchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
