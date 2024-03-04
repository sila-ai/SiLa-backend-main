import { Body, Controller, Get, Post, Request, Response, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { CustomersService } from 'src/stripe/customers/customers.service';
import { UserDto, LoginDto, ForgotPasswordDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import * as dotenv from 'dotenv';
dotenv.config()

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService, private userService: UsersService, private customerService: CustomersService) { }
  @Get('healthcheck')
  healthcheck(){
    return 'App runing';
  }
  @Post('registration')
  async registration(@Body() body: UserDto) {
    const stripe_data = {
      name: body.name,
      email: body.email,
      description: "Signed Up User"
    }
    const customer = await this.customerService.createCustomer(stripe_data)
    console.log(customer)
    const user = await this.userService.create(body, customer.customerId)
    return user
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.validateUser(body);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() body: ForgotPasswordDto, @Response() res) {
    const user = await this.userService.findByEmail(body.email)

    if (user) {
      const response = await this.userService.ForgotPasswordEmail(user)
      return res.status(HttpStatus.OK).json(response);
    } else {
      throw new HttpException('Email not found!', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    console.log("req.user");
    console.log(req.user);
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Request() req, @Response() res) {
    // handles the Google OAuth2 callback
    const jwt: string = req.user.jwt;
    const accessToken: string = req.user.accessToken;
    const isPlanPurchased: number = req.user.isPlanPurchased;

    if (jwt && accessToken && isPlanPurchased) {
      res.redirect('https://silasuite.com/#/auth/success/' + jwt + '/' + accessToken + '/' + isPlanPurchased);
    } else {
      res.redirect('https://silasuite.com/#/auth/failure/1234');
    }
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource() {
    return 'JWT is working!';
  }
}
