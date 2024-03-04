import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString({ message: 'Customer is required' })
  customer: string;

  @IsNotEmpty()
  @IsArray()
  items: (string | number)[];

  @IsString({ message: 'Payment method is required' })
  default_payment_method: string;

  // @IsString({ message: 'Trial end is required' })
  // trial_end: string
}
