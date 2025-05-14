import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly Prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const student = await this.Prisma.student.create({
        data: createStudentDto,
      });
      if (!student) {
        throw new BadRequestException();
      }
      return student;
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
  }

  async findAll() {
    const students = await this.Prisma.student.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    if (!students) {
      throw new BadRequestException();
    }
    return students;
  }

  async findOne(id: number) {
    const student = await this.Prisma.student.findUnique({
      where: {
        id: id,
      },
    });
    if (!student) {
      throw new NotFoundException();
    }
    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const stuId = await this.Prisma.student.findUnique({
        where: {
          id: id,
        },
      });
      if (!stuId) {
        throw new NotFoundException();
      }

      const student = await this.Prisma.student.update({
        where: stuId,
        data: updateStudentDto,
      });
      if (!student) {
        throw new BadRequestException();
      }
      return student;
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    const stuId = await this.Prisma.student.findUnique({
      where: {
        id: id,
      },
    });
    if (!stuId) {
      throw new NotFoundException();
    }
    await this.Prisma.student.delete({
      where: stuId,
    });
    return {
      message: 'Student deleted successfully.',
    };
  }
}
