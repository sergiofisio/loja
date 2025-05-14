export class CreateUserDto {
  id: string;
  name: string;
  email: string;
  document: string;
  password: string;
  admin?: boolean;
  lostPassword?: string;
}
