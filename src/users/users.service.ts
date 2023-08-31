import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly SALT = bcrypt.genSaltSync(10);

  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, this.SALT),
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException();
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findByEmail(email: string) {
    return this.userRepository.listOne({ email });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
