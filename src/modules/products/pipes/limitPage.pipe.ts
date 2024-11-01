import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class LimitPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value = parseInt(value);

    if (isNaN(value)) {
      value = 10;
    }

    if (value < 1) {
      throw new BadRequestException('limit must be greater than 0');
    }

    if (value > 20) {
      return 20
    }

    return value
  }
}
