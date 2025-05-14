export class User {
  id_user: number;
  id: string;
  name: string;
  email: string;
  document: string;
  password: string;
  admin?: boolean;
  lostPassword?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
