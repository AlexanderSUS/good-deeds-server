import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeedsService } from './deeds.service';
import { DeedsController } from './deeds.controller';
import { Deed, DeedSchema } from './deed.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deed.name, schema: DeedSchema }]),
  ],
  controllers: [DeedsController],
  providers: [DeedsService],
})
export class DeedsModule {}
