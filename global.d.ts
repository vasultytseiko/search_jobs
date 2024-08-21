import { type User } from 'src/user/models/user.model';

declare namespace Express {
  export interface Request {
    user_id?: string;
    user?: User;
  }
}
