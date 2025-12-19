import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './review.model';
import { ReviewService } from './review.service';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  controllers: [ReviewController],
  imports: [
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
    TelegramModule,
  ],
  providers: [ReviewService],
})
export class ReviewModule {}
