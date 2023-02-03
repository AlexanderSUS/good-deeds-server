import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { EnvVariables } from 'src/config/envVariables.enum';
import { TokenPayload } from '../interface/tokenPayload.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.get(EnvVariables.refreshSecret),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, { userId }: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;

    return this.usersService.getUserIfRefreshTokenMatches(refreshToken, userId);
  }
}
