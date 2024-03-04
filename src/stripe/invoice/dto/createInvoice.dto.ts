import { IsString } from 'class-validator';

export class CreateInvoiceDto {

    @IsString({ message: 'Customer is required' })
    customer: string
}

