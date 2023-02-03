import { Request } from 'express';
import { User } from 'src/users/user.schema';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
