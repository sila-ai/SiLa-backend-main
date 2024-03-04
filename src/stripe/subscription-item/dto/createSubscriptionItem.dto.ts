import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionItemDto {
    
    @IsString({ message: 'Subscription id is required' })
    subscription: string

    @IsString({ message: 'Price is required' })
    price: string

    @IsNotEmpty({ message: 'Quantity should not be empty' })
    @IsNumber()
    quantity: number
}