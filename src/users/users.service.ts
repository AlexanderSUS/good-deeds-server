import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { EnvVariables } from 'src/config/envVariables.enum';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { MongooseErrorCode } from 'src/database/mongooseErrorCode.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const newUser = this.userModel.create(userDto);

    return (await newUser).save();
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneByNickname(nickname: string) {
    const user = await this.userModel.findOne({ nickname });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, id: string) {
    const refreshTokenHash = await bcrypt.hash(
      refreshToken,
      this.configService.get(EnvVariables.cryptSalt),
    );

    await this.userModel.findByIdAndUpdate(id, {
      refreshTokenHash,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findOne(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  private async getNewHashedPassword(
    oldHashedPassword: string,
    oldPlainPassword: string,
    newPlainPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      oldPlainPassword,
      oldHashedPassword,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Password is wrong');
    }

    return bcrypt.hash(
      newPlainPassword,
      this.configService.get(EnvVariables.cryptSalt),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      if (error?.code === MongooseErrorCode.DuplicateKey) {
        throw new BadRequestException('Nickname already exist');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updatePassword(
    id: string,
    { newPassword, oldPassword }: UpdatePasswordDto,
  ) {
    const user = await this.userModel.findById(id);

    user.password = await this.getNewHashedPassword(
      user.password,
      oldPassword,
      newPassword,
    );

    await user.save();
  }

  async removeRefreshToken(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { refreshTokenHash: null })
      .setOptions({ new: true });

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userModel.remove(user);
  }
}
