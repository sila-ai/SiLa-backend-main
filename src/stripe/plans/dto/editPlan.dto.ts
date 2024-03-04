import { IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class EditPlanDto {
    
    @IsNotEmpty({ message: 'Clicks should not be empty and it should be number' })
    nickname: number
}
