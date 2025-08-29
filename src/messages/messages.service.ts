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
    return this.messageRepository.find();
  }

  async findOne(id: number) {
    // const message = this.messages.find((item) => item.id === +id);
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
    });

    if (message) return message;

    // throw new HttpException('Message not found.', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Message not found');
  }

  create(body: MessageRequestDTO) {
    const newMessage = {
      ...body,
      read: false,
      date: new Date(),
    };

    const message = this.messageRepository.create(newMessage);

    return this.messageRepository.save(message);
  }

  async update(id: number, body: MessageUpdateDTO) {
    const partialMessageUpdateDTO = {
      read: body?.read,
      text: body?.text,
    };

    const message = await this.messageRepository.preload({
      id,
      ...partialMessageUpdateDTO,
    });

    if (!message) throw new NotFoundException('Message not found');

    await this.messageRepository.save(message);

    return message;
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) throw new NotFoundException('Message not found');

    return this.messageRepository.remove(message);
  }
}
