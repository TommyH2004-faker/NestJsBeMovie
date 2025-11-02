import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

//  validator
@ValidatorConstraint()
export class isUpperCase implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    console.log(validationArguments);
    return text === text.toUpperCase();
  }
}

// DTO
export class CreateProductDto {
  @IsString()
  @Length(1, 50, {
    message: 'Name must be between 1 and 50 characters long.',
  })
  @IsNotEmpty({ message: 'Name is required.' })
  @Validate(isUpperCase, {
    message: 'Name must be in uppercase.',
  })
  name: string;

  @IsString()
  @Length(1, 200, {
    message: 'Description must be between 1 and 200 characters long.',
  })
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number.' })
  @IsNotEmpty({ message: 'Price is required.' })
  price: number;
}
