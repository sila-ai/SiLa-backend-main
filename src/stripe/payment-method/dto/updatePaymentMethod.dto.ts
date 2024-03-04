import { 
    IsString,
    Min,
    Max,
    IsNotEmpty
} from 'class-validator';

const date = new Date();
const current_year = date.getFullYear();
const next_year = date.getFullYear() + 30;

export class UpdatePaymentMethodDto {
    
    @Min(1)
    @Max(12)
    exp_month: number;

    @Min(current_year)
    @Max(next_year)
    exp_year: number;

    @IsNotEmpty({ message: 'Name should not be empty' })
    @IsString({ message: 'Name is required' })
    name: string;
}

