import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { NOT_VALID_ID_ERROR } from './id-validation.constant';

export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value;
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(NOT_VALID_ID_ERROR);
    }

    return value;
  }
}
