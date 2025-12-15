import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export class ProductModel {
  _id: string;
  image: string;
  title: string;
  price: number;
  oldPrice: number;
  credit: number;
  calculatedRating: number;
  description: string;
  advantages: string;
  disadvantages: string;
  categories: string[];
  tags: string[];
  characteristics: {
    [key: string]: string;
  };
}

export type ProductDocument = HydratedDocument<Product>;

class ProductCharacteristics {
  @Prop()
  name: string;

  @Prop()
  value: string;
}

@Schema()
export class Product {
  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice?: number;

  @Prop()
  credit: number;

  @Prop()
  calculatedRating: number;

  @Prop()
  description: string;

  @Prop()
  advantages: string;

  @Prop()
  disadvantages: string;

  @Prop({ type: () => [String] })
  categories: string[];

  @Prop({ type: () => [String] })
  tags: string[];

  @Prop({ type: () => [ProductCharacteristics] })
  characteristics: ProductCharacteristics[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
