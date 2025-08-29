import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use.');
    }

    const newUser = {
      name,
      email,
      passwordHash: password, // Modificar posteriormente para fazer o hash da senha
    };

    const user = this.userRepository.create(newUser);

    return this.userRepository.save(user);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (user) return user;

    // throw new HttpException('Message not found.', HttpStatus.NOT_FOUND);
    throw new NotFoundException('User not found');
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const partialUserUpdateDTO = {
      name: updateUserDto?.name,
      password: updateUserDto?.password,
    };

    const user = await this.userRepository.preload({
      id,
      ...partialUserUpdateDTO,
    });

    if (!user) throw new NotFoundException('User not found');

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return this.userRepository.remove(user);
  }
}
