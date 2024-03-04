import { 
    Controller,
    Get,
    Response,
    HttpStatus,
    Param,
    Body,
    Post,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/createSession.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
    ) {}

    @Get()
    public async getAllSession(@Response() res) {
        const sessions = await this.sessionService.findAllSession();
        return res.status(HttpStatus.OK).json(sessions);
    }

    @Get('/:id')
    public async getSession(@Response() res, @Param() param) {
        const sessions = await this.sessionService.findSession(param.id);
        return res.status(HttpStatus.OK).json(sessions);
    }

    @Get('items/:id')
    public async getSessionItem(@Response() res, @Param() param) {
        const sessions = await this.sessionService.findSessionItem(param.id);
        return res.status(HttpStatus.OK).json(sessions);
    }

    @Get('clicks/:id')
    public async getAddonTotalClicks(@Response() res, @Param() param) {
        const sessions = await this.sessionService.getAddonTotalClicks(param.id);
        return res.status(HttpStatus.OK).json(sessions);
    }

    @Post()
    public async createSession(
        @Response() res,
        @Body() createSessionDto: CreateSessionDto,
        ) {
        const sessions = await this.sessionService.createSession(
            createSessionDto,
        );
        return res.status(HttpStatus.OK).json(sessions);
    }
}
