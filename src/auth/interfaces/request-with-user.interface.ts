import { Request } from 'express';
import { User } from 'src/user/models/user.model';

export interface RequestWithUser extends Request {
  user: User;
}
