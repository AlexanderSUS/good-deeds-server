import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type DeedDocument = Deed & Document;

@Schema()
export class Deed {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  title: string;

  @Prop()
  isDone: boolean;

  @Prop()
  userId: string;
}

export const DeedSchema = SchemaFactory.createForClass(Deed);
