import {
  IsNotEmpty,
  MinLength,
  Length,
  IsString,
  IsNumber,
  IsNumberString,
} from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty({ message: 'Amount should not be empty' })
  @IsNumber()
  amount: number;

  @IsNotEmpty({ message: 'Currency should not be empty' })
  @IsString({ message: 'Currency is required' })
  currency: string;

  @IsNotEmpty({ message: 'Interval should not be empty' })
  @IsString({ message: 'Interval is required' })
  interval: string;
  @IsString({ message: 'interval_count is required' })
  interval_count: string;

  @IsNotEmpty({ message: 'Product should not be empty' })
  @IsString({ message: 'Product is required' })
  product: string;

  @IsNotEmpty({ message: 'Clicks should not be empty and it should be number' })
  nickname: number;
}
