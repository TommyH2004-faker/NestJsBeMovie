import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  // eslint-disable-next-line prettier/prettier
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(["male", "female", "other"])
  gender?: "male" | "female" | "other";

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}
