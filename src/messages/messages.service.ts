import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { MessageRequestDTO } from './dtos/message-request.dto';
import { MessageUpdateDTO } from './dtos/message-update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  private lastId = 1;

  private messages: Message[] = [
    {
      id: 1,
      text: 'Recado de teste',
      from: 'Maria',
      to: 'João',
      read: false,
      date: new Date(),
    },
  ];

  findAll() {
    return this.messages;
  }

  findOne(id: string) {
    const message = this.messages.find((item) => item.id === +id);

    if (message) return message;

    // throw new HttpException('Message not found.', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Message not found');
  }

  create(body: MessageRequestDTO) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...body,
      read: false,
      date: new Date(),
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  update(id: string, body: MessageUpdateDTO) {
    const messageExistsIndex = this.messages.findIndex(
      (item) => item.id === +id,
    );

    if (messageExistsIndex < 0) {
      throw new NotFoundException('Message not found.');
    }

    if (messageExistsIndex >= 0) {
      const existingMessage = this.messages[messageExistsIndex];

      this.messages[messageExistsIndex] = {
        ...existingMessage,
        ...body,
      };

      return this.messages[messageExistsIndex];
    }
  }

  remove(id: number) {
    const messageExistsIndex = this.messages.findIndex(
      (item) => item.id === id,
    );

    if (messageExistsIndex < 0) {
      throw new NotFoundException('Message not found.');
    }

    const message = this.messages[messageExistsIndex];

    this.messages.splice(messageExistsIndex, 1);

    return message;
  }
}
