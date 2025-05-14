import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(loginAuthDto: LoginAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }

    const newUser = await this.userService.create({
      ...loginAuthDto,
    });

    const token = this.jwtService.sign({ userId: newUser.id });

    return {
      user: newUser,
      access_token: token,
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password.');
    }

    const isPasswordMatch = await this.userService.comparePassword(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid email or password.');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return {
      access_token: token,
      token_type: 'bearer',
    };
  }

  logout(loginAuthDto: LoginAuthDto) {
    return 'This action adds a new auth';
  }
}
