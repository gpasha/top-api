import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewDocument } from './review.model';
import { DeleteResult, Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async create(dto: CreateReviewDto): Promise<ReviewDocument> {
    return this.reviewModel.create({
      ...dto,
      productId: new Types.ObjectId(dto.productId),
    });
  }

  async delete(id: string): Promise<ReviewDocument | null> {
    return this.reviewModel.findByIdAndDelete(id);
  }

  async findByProductId(productId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ productId: new Types.ObjectId(productId) })
      .exec();
  }

  async deleteByProductId(productId: string): Promise<DeleteResult> {
    return this.reviewModel
      .deleteMany({ productId: new Types.ObjectId(productId) })
      .exec();
  }
}
