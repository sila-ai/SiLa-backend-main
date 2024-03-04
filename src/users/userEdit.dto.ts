import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class UserEditDto {

  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name is required' })
  name: string;

  role: string;

  @IsEmail({}, { message: 'Please enter valid Email ID' })
  email: string;

  password: string;

  customerId: string
}