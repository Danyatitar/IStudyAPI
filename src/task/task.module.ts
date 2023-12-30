import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/user/schemas/user.schema';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskSchema } from './schema/task.schema';
import { FileService } from 'src/file/file.service';
import mongoose from 'mongoose';
const DummyFileSchema = new mongoose.Schema({});

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema },
      { name: 'fs.files', schema: DummyFileSchema, collection: 'fs.files' },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, FileService],
})
export class TaskModule {}
