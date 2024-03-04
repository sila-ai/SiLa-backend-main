import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerDto {

    @IsNotEmpty({ message: 'Name should not be empty' })
    @MinLength(2)
    name: string

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Please enter valid Email ID' })
    email: string

    @MaxLength(200)
    description: string
}