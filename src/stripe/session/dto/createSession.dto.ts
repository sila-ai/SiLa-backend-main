import { IsString } from 'class-validator';

export class CreateSessionDto {
    
    @IsString({ message: 'Customer is required' })
    customer: string

    @IsString({ message: 'Price is required' })
    price: string
}

