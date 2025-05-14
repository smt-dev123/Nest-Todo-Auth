import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    if (createUserDto.email && createUserDto.email.length > 0) {
      const user = await this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });
      if (user) {
        throw new BadRequestException('Email already exists');
      }
    }
    try {
      const users = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hash,
        },
      });
      if (!users) {
        throw new BadRequestException('User not created');
      }
      return users;
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { id: 'desc' },
      });
      if (!users) {
        throw new BadRequestException('No users found');
      }
      return users;
    } catch (error) {
      throw new BadRequestException('Failed to find users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to find user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        const saltOrRounds = 10;
        const password = updateUserDto.password;
        const hash = await bcrypt.hash(password, saltOrRounds);
        updateUserDto.password = hash;
      }
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: updateUserDto.password,
        },
      });
      if (!user) {
        throw new BadRequestException('User not updated');
      }
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('User not found');
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });
      if (!user) {
        throw new BadRequestException('User not deleted');
      }
      return 'User deleted successfully.';
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('User not found');
      }
      throw new BadRequestException('Failed to delete user');
    }
  }

  comparePassword = async (password: string, hash: string) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  };
}
