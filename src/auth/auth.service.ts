import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interface/tokenPayload.interface';
import { EnvVariables } from 'src/config/envVariables.enum';
import { MongooseErrorCode } from 'src/database/mongooseErrorCode.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public getCookieWithJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get(EnvVariables.accessTokenSecret),
      expiresIn: this.configService.get(EnvVariables.accessExpiration),
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      EnvVariables.accessExpiration,
    )}`;
  }

  public getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get(EnvVariables.refreshSecret),
      expiresIn: this.configService.get(EnvVariables.refreshExpiration),
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      EnvVariables.refreshExpiration,
    )}`;

    return { cookie, token };
  }

  public getCookieForLogOut() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      `Refresh=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }

  public async getAuthenticatedUser(
    nickname: string,
    plainTextPassword: string,
  ) {
    const user = await this.usersService.findOneByNickname(nickname);

    await this.verifyPassword(plainTextPassword, user.password);

    user.password = undefined;

    return user;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Password is wrong');
    }
  }

  async register(registrationData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      registrationData.password,
      this.configService.get(EnvVariables.cryptSalt),
    );
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      if (error?.code === MongooseErrorCode.DuplicateKey) {
        throw new BadRequestException('Nickname already exist');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
