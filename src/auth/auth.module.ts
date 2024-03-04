import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { CustomersModule } from 'src/stripe/customers/customers.module';
import { GoogleStrategy } from './google.strategy';
import { SubscriptionsModule } from 'src/stripe/subscriptions/subscriptions.module';

@Module({
  imports: [
    UsersModule, 
    PassportModule,
    CustomersModule,
    SubscriptionsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [LocalStrategy,AuthService,JwtModule],
  controllers: [AuthController]
})
export class AuthModule {}
