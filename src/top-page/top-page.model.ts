import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum TopLevelCategories {
  Courses,
  Services,
  Books,
  Products,
}

export class TopPageModel {
  _id: string;
  firstCategory: TopLevelCategories;
  secondCategory: string;
  title: string;
  category: string;
  hh?: {
    count: number;
    juniourSalary: number;
    middleSalary: number;
    seniorSalary: number;
  };
  advantages: {
    title: string;
    description: string;
  }[];
  seoText: string;
  tagsTitle: string;
  tags: string[];
}

export type TopPageDocument = HydratedDocument<TopPage>;

class HhData {
  @Prop()
  count: number;

  @Prop()
  juniourSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;
}

class TopPageAdvantage {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

@Schema()
export class TopPage {
  @Prop({ enum: TopLevelCategories })
  firstCategory: TopLevelCategories;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop({ type: () => HhData })
  hh?: HhData;

  @Prop({ type: () => [TopPageAdvantage] })
  advantages: TopPageAdvantage[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop({ type: () => [String] })
  tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPage);

// TopPageSchema.index({ title: 'text', seoText: 'text' });
TopPageSchema.index({ '$**': 'text' });
