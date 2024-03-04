import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePriceDto {
    
    @IsNotEmpty({ message: 'Unit amount should not be empty' })
    @IsNumber()
    unit_amount: number

    @IsNotEmpty({ message: 'Currency should not be empty' })
    @IsString({ message: 'Currency is required' })
    currency: string

    @IsNotEmpty({ message: 'Product should not be empty' })
    @IsString({ message: 'Product is required' })
    product: string

    @IsNotEmpty({ message: 'Clicks should not be empty' })
    @IsNumber()
    nickname: number
}
