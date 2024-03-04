import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { stripe } from 'src/stripe/stripe';
import * as bcrypt from 'bcrypt';
import { UserDtoAuth } from './user.dto';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UsersService {
  private readonly stripe: Stripe = stripe;
  private saltRounds = 10;
  private readonly JWT_SECRET_KEY = jwtConstants.secret;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async createViaAuth(user: UserDtoAuth, customerId: string = null) {
    user.customerId = customerId;
    return await this.userRepository.save(user).catch((error) => {
      throw new HttpException(error, HttpStatus.NOT_ACCEPTABLE);
    });
  }

  async create(user: User, customerId: string = null) {
    user.customerId = customerId;
    user.password = await this.getHash(user.password);
    const userCreated = await this.userRepository.save(user);
    return {
      access_token: this.jwtService.sign(userCreated),
      user_info: {
        "id": userCreated.id,
        "customerId": userCreated.customerId,
        "name": userCreated.name,
        "role": userCreated.role,
        "email": userCreated.email,
        "chat_id": userCreated.chat_id,
        "isFirstTime":userCreated.isFirstTime,
        "isPlanPurchased": 1
      }
    }
  }

  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(
    password: string | undefined,
    hash: string | undefined,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async findOne(id: number) {
    return await this.userRepository.findOne(id).catch((error) => {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    });
  }

  async findAdmin(email: string, role: string) {
    return await this.userRepository
      .findOne({ where: { email: email, role: role } })
      .catch((error) => {
        throw new HttpException(error, HttpStatus.NOT_FOUND);
      });
  }

  async getAdminUser() {
    const getNormalEmail = await this.userRepository.findOne({
      where: { email: 'zenireland@gmail.com' },
    });
    if (!getNormalEmail) {
      const password = await this.getHash('zenireland@gmail.com');
      const user = {
        email: 'zenireland@gmail.com',
        password: password,
        name: 'Zen',
        is_agree: true,
        role: 'USER',
      };
      await this.userRepository.save(user);
    }
 
    const getEmail = await this.userRepository.findOne({
      where: { email: 'zen@gmail.com' },
    });
    if (!getEmail) {
      const password = await this.getHash('zen@gmail.com');
      const user = {
        email: 'zen@gmail.com',
        password: password,
        role: 'ADMIN',
        name: 'Zen',
        is_agree: true,
      };
      await this.userRepository.save(user);
    }

    if (getEmail) {
      console.log('getEmail');
      console.log(getEmail);
      await this.userRepository.update(
        { email: 'zen@gmail.com' },
        { role: 'ADMIN' },
      );
    }
    return { success: true , today: 13};
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository
      .findOne({ where: { email: email } })
      .catch((error) => {
        throw new HttpException(error, HttpStatus.NOT_FOUND);
      });
  }

  async findAllUser(role: string): Promise<User[]> {
    return await this.userRepository
      .find({ where: { role: role } })
      .catch((error) => {
        throw new HttpException(error, HttpStatus.NOT_FOUND);
      });
  }

  async findCustomerUser(customerId: string): Promise<User[]> {
    return await this.userRepository
      .find({ where: { customerId: customerId } })
      .catch((error) => {
        throw new HttpException(error, HttpStatus.NOT_FOUND);
      });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find().catch((error) => {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    });
  }

  async update(user: User, data: any): Promise<UpdateResult> {
    if (data.password) {
      data.password = await this.getHash(data.password);
    }
    return await this.userRepository.update(user, data).catch((error) => {
      throw new HttpException(error, HttpStatus.NOT_MODIFIED);
    });
  }

  async updatePassword(user: User, data: any): Promise<any> {
    if (data.password == data.confirmPassword) {
      const upateData: any = {
        password: await this.getHash(data.password),
      };
      return await this.userRepository
        .update(user, upateData)
        .catch((error) => {
          throw new HttpException(error, HttpStatus.NOT_MODIFIED);
        });
    } else {
      return { status: 400, error: 'Password and confirmPassword not match!' };
    }
  }

  async update_chat_id(user: User, data: any): Promise<UpdateResult> {
    return await this.userRepository.update(user, data).catch((error) => {
      throw new HttpException(error, HttpStatus.NOT_MODIFIED);
    });
  }

  async getChatId(id) {
    return await this.userRepository.find(id).catch((error) => {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id).catch((error) => {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    });
  }

  async ForgotPasswordEmail(userInfo: any) {
    const payload = {
      id: userInfo.id,
    };

    const jwt: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: '1h' });

    const mailData: any = {
      customer_name: userInfo['name'],
      subject: 'Reset Password Email',
      heading: 'Reset Password',
      email: userInfo['email'],
      reset_link: process.env.RESET_PASSWORD_URL + '/' + jwt,
      frontend_link: process.env.FRONTEND_URL,
      template: './forgot-password',
    };
    await this.emailService.sendEmail(mailData);
    return { status: true, message: 'Email sent!' };
  }
}
