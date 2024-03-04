import { IsNotEmpty, IsEmail, IsString, Matches } from 'class-validator';

export class ContactDto {

  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Contact number is required' })
  @Matches(/[0-9]{10}/,{
    message:`Invalid number`
  })
  contactNumber: number;

  @IsEmail({}, { message: 'Please enter valid Email ID' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  createDateTime: string;
}