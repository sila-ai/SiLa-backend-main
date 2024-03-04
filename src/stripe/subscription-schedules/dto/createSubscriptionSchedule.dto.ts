import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class CreateSubscriptionScheduleDto {
    
    @IsString({ message: 'Customer is required' })
    customer: string

    @IsNumber()
    start_date: number

    @IsString({ message: 'End behavior is required' })
    end_behavior: string

    @IsNotEmpty()
    @IsArray()
    phases: (string | number)[]
}
