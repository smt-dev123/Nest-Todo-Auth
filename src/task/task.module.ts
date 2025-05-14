import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // the directory to serve static files from
      serveRoot: '/uploads', // the path you want to use for accessing your uploads
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
