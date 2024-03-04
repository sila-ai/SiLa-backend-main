import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionSchedulesService } from './subscription-schedules.service';

describe('SubscriptionSchedulesService', () => {
  let service: SubscriptionSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionSchedulesService],
    }).compile();

    service = module.get<SubscriptionSchedulesService>(SubscriptionSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
