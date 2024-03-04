import { 
    IsString,
    IsNumber,
    Min,
    Max,
    IsNotEmpty
} from 'class-validator';

const date = new Date();
const current_year = date.getFullYear();
const next_year = date.getFullYear() + 30;

export class CreatePaymentMethodDto {
    
    @IsNumber()
    card_number: number;
  
    @Min(1)
    @Max(12)
    exp_month: number;

    @Min(current_year)
    @Max(next_year)
    exp_year: number;

    @Min(100)
    @Max(999)
    cvc: number;

    @IsNotEmpty({ message: 'Name should not be empty' })
    @IsString({ message: 'Name is required' })
    name: string;
}

