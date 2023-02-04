import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import RequestWithUser from 'src/auth/interface/reuestWithUser.interface';
import { DeedsService } from 'src/deeds/deeds.service';

@Injectable()
export class DeedGuard implements CanActivate {
  constructor(private readonly deedService: DeedsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context
      .switchToHttp()
      .getRequest<RequestWithUser>();

    const deed = await this.deedService.findOne(params.id);

    return deed.userId === user._id.toString();
  }
}
