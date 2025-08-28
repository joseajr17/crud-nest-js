import { PartialType } from '@nestjs/mapped-types';
import { MessageRequestDTO } from './message-request.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class MessageUpdateDTO extends PartialType(MessageRequestDTO) {
  @IsBoolean()
  @IsOptional()
  readonly read?: boolean;
}
