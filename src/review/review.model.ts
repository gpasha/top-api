import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export class ReviewModel {
  _id: Types.ObjectId;
  name: string;
  title: string;
  description: string;
  rating: number;
  // author: Types.ObjectId;
  productId: Types.ObjectId;
}

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;

  // @Prop({ type: Types.ObjectId })
  // author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
