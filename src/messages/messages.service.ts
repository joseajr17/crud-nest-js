import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { MessageRequestDTO } from './dtos/message-request.dto';
import { MessageUpdateDTO } from './dtos/message-update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async create(body: MessageRequestDTO) {
    const { fromId, toId, text } = body;

    const from = await this.usersService.findOne(fromId);

    const to = await this.usersService.findOne(toId);

    const newMessage = {
      text,
      from,
      to,
      read: false,
      date: new Date(),
    };

    const message = this.messageRepository.create(newMessage);
    await this.messageRepository.save(message);

    return {
      ...message,
      from: {
        id: message.from,
      },
      to: {
        id: message.to,
      },
    };
  }

  findAll() {
    return this.messageRepository.find({
      relations: ['from', 'to'],
      order: {
        id: 'desc',
      },
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: number) {
    // const message = this.messages.find((item) => item.id === +id);
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
      relations: ['from', 'to'],
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });

    if (message) return message;

    // throw new HttpException('Message not found.', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Message not found');
  }

  async update(id: number, body: MessageUpdateDTO) {
    const message = await this.findOne(id);

    message.text = body?.text ?? message.text;
    message.read = body?.read ?? message.read;

    await this.messageRepository.save(message);
    return message;
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) throw new NotFoundException('Message not found');

    return this.messageRepository.remove(message);
  }
}
