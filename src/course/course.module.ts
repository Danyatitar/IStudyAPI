import { FileService } from './../file/file.service';
import { WorkService } from './../work/work.service';
import { TaskService } from './../task/task.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { UserSchema } from '../user/schemas/user.schema';
import { CourseSchema } from './shemas/course.shema';
import { TaskSchema } from 'src/task/schema/task.schema';
import { WorkSchema } from 'src/work/schema/work.schema';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: 'Work', schema: WorkSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService, TaskService, WorkService, FileService],
})
export class CourseModule {}
