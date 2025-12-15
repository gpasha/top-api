import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export class UserModel {
  email: string;
  passwordHash: string;
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
