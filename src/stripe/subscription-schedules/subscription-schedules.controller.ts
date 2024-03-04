import { 
    Controller,
    Get,
    Response,
    HttpStatus,
    Param,
    Body,
    Post,
    Patch,
} from '@nestjs/common';
import { CreateSubscriptionScheduleDto } from './dto/createSubscriptionSchedule.dto';
import { SubscriptionSchedulesService } from './subscription-schedules.service';

@Controller('subscription-schedules')
export class SubscriptionSchedulesController {
    
    constructor(private readonly subscriptionSchedulesService: SubscriptionSchedulesService) {}

    @Get()
    public async getSubscriptionSchedules(@Response() res) {
        const subscriptionSchedules = await this.subscriptionSchedulesService.findAllSubscriptionSchedules();
        return res.status(HttpStatus.OK).json(subscriptionSchedules);
    }

    @Get('/:id')
    public async getSubscriptionSchedule(@Response() res, @Param() param) {
        const subscriptionSchedule = await this.subscriptionSchedulesService.findSubscriptionSchedule(param.id);
        return res.status(HttpStatus.OK).json(subscriptionSchedule);
    }

    @Post()
    public async createSubscriptionSchedules(
        @Response() res,
        @Body() createSubscriptionScheduleDto: CreateSubscriptionScheduleDto,
        ) {
        const subscriptionSchedule = await this.subscriptionSchedulesService.createSubscriptionSchedules(
            createSubscriptionScheduleDto,
        );
        return res.status(HttpStatus.OK).json(subscriptionSchedule);
    }

    @Patch('/:id')
    public async updateSubscriptionSchedule(@Param() param, @Response() res, @Body() body) {
        const subscriptionSchedule = await this.subscriptionSchedulesService.updateSubscriptionSchedule(param.id, body);
        return res.status(HttpStatus.OK).json(subscriptionSchedule);
    }

    @Post('/:id/cancel')
    public async cancelSubscriptionSchedule(@Param() param, @Response() res){
        const subscriptionSchedule = await this.subscriptionSchedulesService.cancelSubscriptionSchedule(param.id);
        return res.status(HttpStatus.OK).json(subscriptionSchedule);
    }

    @Post('/:id/release')
    public async releaseSubscriptionSchedule(@Param() param, @Response() res){
        const subscriptionSchedule = await this.subscriptionSchedulesService.releaseSubscriptionSchedule(param.id);
        return res.status(HttpStatus.OK).json(subscriptionSchedule);
    }
}
