import { Module } from '@nestjs/common';
import { CustomersModule } from '../customers/customers.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
    imports: [CustomersModule],
    providers: [SessionService],
    exports: [SessionService],
    controllers: [SessionController],
})
export class SessionModule {}
