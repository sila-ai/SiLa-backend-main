import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { StripeModule } from 'src/stripe/stripe.module';
import { CustomersModule } from 'src/stripe/customers/customers.module';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    StripeModule,
    CustomersModule,
    EmailModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '365d' },
    }),
  ],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService, JwtModule],
  controllers: [UsersController],
})
export class UsersModule {}
