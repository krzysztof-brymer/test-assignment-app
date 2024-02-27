import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUser {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
