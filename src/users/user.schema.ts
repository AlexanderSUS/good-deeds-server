import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ unique: true })
  nickname: string;

  @Prop()
  password: string;

  @Prop()
  refreshTokenHash: string;

  @Prop([String])
  friendsIds: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
