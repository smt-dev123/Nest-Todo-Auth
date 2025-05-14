import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = await this.prisma.task.create({
        data: createTaskDto,
      });
      if (!task) {
        throw new BadRequestException('Task not created');
      }
      return task;
    } catch (error) {
      throw new BadRequestException('Failed to create task');
    }
  }

  async findAll() {
    try {
      const tasks = await this.prisma.task.findMany({
        orderBy: { id: 'desc' },
      });
      if (!tasks) {
        throw new BadRequestException('Tasks not found');
      }
      return tasks;
    } catch (error) {
      throw new BadRequestException('Failed to find tasks');
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id,
        },
      });
      if (!task) {
        throw new BadRequestException('Task not found');
      }
      return task;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Task not found');
      }
      throw new BadRequestException('Failed to find task');
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.update({
        where: {
          id,
        },
        data: updateTaskDto,
      });
      if (!task) {
        throw new BadRequestException('Task not updated');
      }
      return task;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Task not found');
      }
      throw new BadRequestException('Failed to update task');
    }
  }

  async remove(id: number) {
    try {
      const task = await this.prisma.task.delete({
        where: {
          id,
        },
      });
      if (!task) {
        throw new BadRequestException('Task not deleted');
      }
      return 'Task deleted successfully.';
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Task not found');
      }
      throw new BadRequestException('Failed to delete task');
    }
  }
}
