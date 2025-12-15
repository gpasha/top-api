import { IsEnum } from 'class-validator';
import { TopLevelCategories } from '../top-page.model';

export class FindTopPageDto {
  @IsEnum(TopLevelCategories)
  firstCategory: TopLevelCategories;
}
