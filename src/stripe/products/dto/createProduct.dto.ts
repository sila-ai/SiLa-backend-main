import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProductDto {

    @IsNotEmpty({ message: 'Product name should not be empty' })
    @IsString({ message: 'Product name is required' })
    name: string;
}

