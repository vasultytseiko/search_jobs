import { CreateUserDto } from '../dto/create-user.dto';

export type CreateUserParams = CreateUserDto & {
  postcode_longitude: number;
  postcode_latitude: number;
  auth_user_id: string;
};

export type UpdateUserParams = CreateUserDto & {
  postcode_longitude?: number;
  postcode_latitude?: number;
};
