import { Injectable, NotFoundException } from '@nestjs/common';
import { Deed, DeedDocument } from './deed.schema';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DeedsService {
  constructor(@InjectModel(Deed.name) private deedModel: Model<DeedDocument>) {}

  create(createDeedDto: CreateDeedDto, userId: string) {
    const createDeed = new this.deedModel({
      ...createDeedDto,
      userId,
      isDone: false,
    });

    return createDeed.save();
  }

  findAll(userId: string) {
    return this.deedModel.find({ userId });
  }

  async findOne(id: string) {
    const deed = await this.deedModel.findById(id);

    if (!deed) {
      throw new NotFoundException();
    }

    return deed;
  }

  async update(id: string, updateDeedDto: UpdateDeedDto) {
    const deed = await this.deedModel
      .findByIdAndUpdate(id, {
        ...updateDeedDto,
      })
      .setOptions({ new: true });

    if (!deed) {
      throw new NotFoundException();
    }

    return deed;
  }

  remove(id: string) {
    return this.deedModel.findByIdAndDelete(id);
  }
}
