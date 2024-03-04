import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { sign } from 'jsonwebtoken';
import { jwtConstants } from './constants';
import { CustomersService } from 'src/stripe/customers/customers.service';
import { SubscriptionsService } from 'src/stripe/subscriptions/subscriptions.service';

export enum Provider {
  GOOGLE = 'google'
}

@Injectable()
export class AuthService {

  private readonly JWT_SECRET_KEY = jwtConstants.secret;

  constructor(
    private usersService: UsersService,
    private customerService: CustomersService,
    private subscriptionsService: SubscriptionsService,
    private jwtService: JwtService
  ) { }

  async validateUser(data: { email: string, password: string }): Promise<any> {
    if (!(data && data.email && data.password)) {
      return { status: false, message: 'Email and password are required!' };
    }

    let isPlanPurchased: number = 1;

    const user = await this.usersService.findByEmail(data.email);
    console.log(user)
    //user.customerId=""
    /*const stripe_data = {
      name: user.name,
      email: user.email,
      description: "Signed Up User"
    }
    const customer = await this.customerService.createCustomer(stripe_data)
    await this.usersService.update(user,{customerId:customer.customerId})
    user.customerId=customer.customerId;*/
    
    if (user) {
      if(user.role == "USER" && data.email !== 'zenireland@gmail.com'){
        // **********CHECK CUSTOMER HAVE SUBSCRIPTION OR NOT***********
        const subscription_list = await this.subscriptionsService.findCustomerActiveSubscription(user.customerId);
        console.log(subscription_list)
        if (!subscription_list.data.length && data.email !== 'zenireland@gmail.com') {
          isPlanPurchased = 2;
        }
      }

      
      if (await this.usersService.compareHash(data.password, user.password)) {//await this.usersService.compareHash(data.password, user.password)
        const { password, ...result } = user;
        if(user.isFirstTime)
        await this.usersService.update(user,{isFirstTime:false})
        return {
          access_token: this.jwtService.sign(result),
          user_info: {
            "id": user.id,
            "customerId": user.customerId,
            "name": user.name,
            "role": user.role,
            "email": user.email,
            "chat_id": user.chat_id,
            "isFirstTime":user.isFirstTime,
            "isPlanPurchased": isPlanPurchased
          }
        };
      }
    }
    return { status: false, message: 'Email or password wrong!' };
  }

  createToken(user: User): any {
    return {
      access_token: this.jwtService.sign(user),
      user_info: {
        "id": user.id,
        "customerId": user.customerId,
        "name": user.name,
        "role": user.role,
        "email": user.email,
        "chat_id": user.chat_id
      }
    }
  }

  async validateOAuthLogin(thirdPartyId: string, accessToken: string, userInfo: any, provider: Provider): Promise<string> {
    try {
      // You can add some registration logic here, 
      const stripe_data = {
        name: userInfo.displayName,
        email: userInfo.email,
        description: "Google User"
      }

      const user = await this.usersService.findByEmail(userInfo.email);
      if (!user) {
        const customer = {id:'test'}//await this.customerService.createCustomer(stripe_data);

        const user_data = {
          name: userInfo.displayName,
          email: userInfo.email,
          picture: userInfo.picture,
          customerId: customer.id
        }
        const newUser = await this.usersService.createViaAuth(user_data, customer.id);
        const sub = await this.checkUserSubscription(newUser);
        const user_info = this.createGoogleAuthToken(newUser, accessToken, sub)
        return user_info;
      } else {
        const sub = await this.checkUserSubscription(user);
        const user_info = this.createGoogleAuthToken(user, accessToken, sub)
        return user_info;
      }
    }
    catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  createGoogleAuthToken(user: User, accessToken: string, sub): any {
    const result = this.usersService.findByEmail(user.email);
    const jwt: string = sign(JSON.stringify(user), this.JWT_SECRET_KEY);
    return {
      accessToken: accessToken,
      jwt: jwt,
      isPlanPurchased: sub.status,
      user_info: {
        "id": user.id,
        "customerId": user.customerId,
        "name": user.name,
        "email": user.email,
        "chat_id": user.chat_id
      }
    }
  }

  // Status:1 = "Plan purchased"
  // Status:2 = "Zero plan purchased"

  async checkUserSubscription(user: User) {
    if(user.role == "USER"){
      // **********CHECK CUSTOMER HAVE SUBSCRIPTION OR NOT***********
      const subscription_list = await this.subscriptionsService.findCustomerActiveSubscription(user.customerId);
      // if (!subscription_list.data.length) {
      //   return { status: 2 };
      // }
      return { status: 1 };
    }
    return { status: 1 };
  }
}
