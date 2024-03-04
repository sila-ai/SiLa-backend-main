import { MinLength, MaxLength, IsString } from 'class-validator';

export class UserPasswordDto {

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    confirmPassword: string;
}