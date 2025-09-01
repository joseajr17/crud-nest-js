import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') return value;

    const parsedValue = Number(value);

    if (parsedValue < 1)
      throw new BadRequestException(
        'Param ID must be positive. Greater than zero',
      );

    if (isNaN(parsedValue))
      throw new BadRequestException('Param ID is not a numeric string');

    console.log('PIPE Value: ', value);
    console.log('PIPE Metadata: ', metadata);
    return parsedValue;
  }
}
