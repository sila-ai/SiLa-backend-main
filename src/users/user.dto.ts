import { IsNotEmpty, IsEmail, Length, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Role is required' })
  role: string;

  @IsEmail({}, { message: 'Please enter valid Email ID' })
  email: string;

  @Length(6, 15)
  password: string;

  customerId: string

  picture: string

  isFirstTime: boolean

  @IsNotEmpty({ message: 'Please agree terms & conditions' })
  is_agree: boolean
}

export class UserDtoAuth {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Please enter valid Email ID' })
  email: string;

  customerId: string;

  picture: string
}

export class LoginDto {
  @IsEmail({}, { message: 'Please enter valid Email ID' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Please enter valid Email ID' })
  email: string;
}