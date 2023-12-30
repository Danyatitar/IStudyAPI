import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskService } from './task.service';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Put,
  Param,
  Res,
  Get,
  Query,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';

@Controller('tasks')
export class TaskController {
  constructor(
    private FileService: FileService,
    private TaskService: TaskService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createTask(
    @UploadedFile() file: Express.Multer.File,
    @Body() taskDto: CreateTaskDto,
  ) {
    if (file) {
      const fileId = await this.FileService.storeFile(file);
      return this.TaskService.createTask(taskDto, fileId);
    }
    return this.TaskService.createTask(taskDto, null);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  async updateTask(
    @UploadedFile() file: Express.Multer.File,
    @Body() taskDto: UpdateTaskDto,
    @Param('id')
    taskId: mongoose.Schema.Types.ObjectId,
  ) {
    if (file) {
      const oldFile = await this.TaskService.getTask(taskId);
      await this.FileService.deleteFileById(oldFile.fileId);
      const fileId = await this.FileService.storeFile(file);
      return this.TaskService.updateTask(taskDto, fileId, taskId);
    }

    return this.TaskService.updateTask(taskDto, null, taskId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getTasks(
    @Query('courseId')
    courseId: mongoose.Schema.Types.ObjectId,
  ) {
    return this.TaskService.getTasksByCourse(courseId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/file')
  async getFile(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Res() res,
  ) {
    const task = await this.TaskService.getTask(id);
    // const { stream, filename } = await this.FileService.getFileStream(
    //   task.fileId,
    // );
    // res.set('Content-Type', 'application/octet-stream');
    // res.set('Content-Disposition', `inline; filename=${filename}`);
    // stream.pipe(res);
    const file = await this.FileService.getFileById(task.fileId);
    console.log(file.filename);
    console.log(res.getHeaders());
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    res.setHeader('Content-Type', file.contentType);
    console.log(res.getHeaders());

    file.stream.pipe(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteTask(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<void> {
    await this.TaskService.deleteTask(id);
  }
}
