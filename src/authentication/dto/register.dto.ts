import { IsEmail } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;
}

export default RegisterDto;
