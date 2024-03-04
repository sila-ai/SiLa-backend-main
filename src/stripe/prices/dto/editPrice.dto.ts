import { IsNotEmpty, IsNumber } from 'class-validator';

export class EditPriceDto {
    
    @IsNotEmpty({ message: 'Clicks should not be empty' })
    @IsNumber()
    nickname: number
}
