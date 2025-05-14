export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  address: string;
  role: string;
}

export class UpdatePasswordDto {
  password: string;
}