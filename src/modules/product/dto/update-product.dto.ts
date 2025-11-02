import { IsDate, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export default class UpdateProductDto {
  @IsNumber({}, { message: 'ID must be a number.' })
  id: number;

  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  // eslint-disable-next-line prettier/prettier
  name?: string;

  @IsString({ message: 'Description must be a string.' })
  @Length(1, 200, {
    message: 'Description must be between 1 and 200 characters long.',
  })
  description?: string;

  @IsNumber({}, { message: 'Price must be a number.' })
  price?: number;
  @Type(() => Date)
  @IsDate({ message: 'CreatedAt must be a date.' })
  createdAt?: Date;

  @Type(() => Date)
  @IsDate({ message: 'UpdatedAt must be a date.' })
  updatedAt?: Date;
}
