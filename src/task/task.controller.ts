import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { multerConfig } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs/promises';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  // Utility function to get image path
  private getImagePath(file: Express.Multer.File): string | null {
    return file ? `uploads/${file.filename}` : null;
  }

  // Utility function to delete image
  private async deleteImage(imagePath: string): Promise<void> {
    if (!imagePath) return;
    const normalizedPath = imagePath.replace(/^task\//, '');
    const fullPath = join(process.cwd(), 'public', normalizedPath);
    try {
      await fs.unlink(fullPath);
      console.log('Image deleted:', fullPath);
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  }

  @Roles(Role.User)
  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createTaskWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<any> {
    if (file) {
      createTaskDto.image = `uploads/${file.filename}`;
    }
    return this.taskService.create(createTaskDto);
  }

  @Roles(Role.User)
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Roles(Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Roles(Role.User)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<any> {
    const task = await this.taskService.findOne(+id);
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);

    if (file && task.image) await this.deleteImage(task.image);
    updateTaskDto.image = this.getImagePath(file) ?? updateTaskDto.image;
    return this.taskService.update(+id, updateTaskDto);
  }

  @Roles(Role.User)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const task = await this.taskService.findOne(+id);
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);

    if (task.image) await this.deleteImage(task.image);
    await this.taskService.remove(+id);
  }
}
