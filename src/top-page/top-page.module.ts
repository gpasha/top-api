import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageSchema } from './top-page.model';
import { TopPageService } from './top-page.service';
import { HhModule } from 'src/hh/hh.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TopPageController],
  imports: [
    MongooseModule.forFeature([{ name: 'TopPage', schema: TopPageSchema }]),
    HhModule,
    ConfigModule,
  ],
  providers: [TopPageService],
  exports: [TopPageService],
})
export class TopPageModule {}
