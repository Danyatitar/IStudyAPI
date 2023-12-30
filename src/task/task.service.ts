import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { FileService } from './../file/file.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Task } from './schema/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<Task>,
    private fileService: FileService,
  ) {}

  async createTask(taskDto: CreateTaskDto, fileId: string): Promise<Task> {
    let file = null;
    if (fileId) {
      file = new mongoose.Types.ObjectId(fileId);
    }
    const task = await this.taskModel.create({
      name: taskDto.name,
      maxMark: Number(taskDto.maxMark),
      description: taskDto.description,
      allowPublication: Boolean(taskDto.allowPublication),
      fileId: file,
      deadline: new Date(taskDto.deadline),
      courseId: new mongoose.Types.ObjectId(taskDto.courseId),
    });
    return task;
  }

  async updateTask(
    taskDto: UpdateTaskDto,
    fileId: string,
    taskId: mongoose.Schema.Types.ObjectId,
  ): Promise<Task> {
    if (fileId) {
      taskDto.fileId = fileId;
    }
    const task = await this.taskModel.findByIdAndUpdate(taskId, taskDto, {
      new: true,
    });

    return task;
  }

  async getTasksByCourse(
    courseId: mongoose.Schema.Types.ObjectId,
  ): Promise<Task[]> {
    const tasks = await this.taskModel
      .find({
        courseId,
      })
      .populate('fileId');

    // const tasksWithFileData = await Promise.all(
    //   tasks.map(async (task) => {
    //     if (task.fileId) {
    //       const fileData = await this.getFileData(task.fileId);

    //       task.fileData = fileData;
    //     }
    //     return task;
    //   }),
    // );

    return tasks;
  }

  async getTask(taskId: mongoose.Schema.Types.ObjectId): Promise<Task> {
    const task = this.taskModel.findById(taskId);
    return task;
  }

  async deleteTask(taskId: mongoose.Schema.Types.ObjectId): Promise<void> {
    const task = await this.taskModel.findByIdAndDelete(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.fileId) {
      await this.fileService.deleteFileById(task.fileId);
    }
  }
}
