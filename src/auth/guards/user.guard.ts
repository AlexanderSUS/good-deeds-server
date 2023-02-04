import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import RequestWithUser from 'src/auth/interface/reuestWithUser.interface';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context
      .switchToHttp()
      .getRequest<RequestWithUser>();

    return user._id.toString() === params.id;
  }
}
