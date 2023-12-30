import { WorkService } from './../work/work.service';
import { TaskService } from './../task/task.service';
import {
  CreateCourseDto,
  JoinCourseDto,
  DeleteStudentsDto,
} from './dto/course.dto';
import { Course } from './shemas/course.shema';
import { CourseService } from './course.service';
import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Request,
  Patch,
  Delete,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import mongoose from 'mongoose';

@Controller('courses')
export class CourseController {
  constructor(
    private CourseService: CourseService,
    private WorkService: WorkService,
    private TaskService: TaskService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createCourse(
    @Body()
    createCourseDto: CreateCourseDto,
    @Request() req,
  ): Promise<Course> {
    return this.CourseService.createCourse(createCourseDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async changeName(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Body()
    courseDto: CreateCourseDto,
  ): Promise<Course> {
    return this.CourseService.changeName(courseDto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('join')
  async joinCourse(
    @Body()
    joinCourseDto: JoinCourseDto,
    @Request() req,
  ): Promise<Course> {
    return this.CourseService.joinStudent(req.user.id, joinCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getMyCourses(@Request() req): Promise<Course> {
    return this.CourseService.getMyCourses(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/students')
  async getStudents(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<Course> {
    return this.CourseService.getStudents(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getCourse(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Request() req,
  ): Promise<Course> {
    return this.CourseService.getCourse(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/standings')
  async getCourseStandigs(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<any> {
    const students = (await this.CourseService.getStudents(id)).students;
    const tasks = await this.TaskService.getTasksByCourse(id);

    const works = await this.WorkService.getWorksByCourse(id);

    let result = works.map((work) => {
      return {
        taskId: work.taskId._id,
        task: work.taskId.name,
        maxMark: work.taskId.maxMark,
        works: works
          .filter((item) => item.taskId._id === work.taskId._id)
          .map((item) => {
            if (item.mark) {
              return {
                studentId: item.studentId._id,
                studentName: item.studentId.name,
                mark: item.mark,
                avgMark: item.avgMark,
              };
            } else {
              return {
                studentId: item.studentId._id,
                studentName: item.studentId.name,
                mark: 0,
                avgMark: item.avgMark,
              };
            }
          }),
      };
    });

    const uniqueTaskIds = {};
    result = result.filter((obj) => {
      if (!uniqueTaskIds.hasOwnProperty(obj.taskId)) {
        uniqueTaskIds[obj.taskId] = true;
        return true;
      }
      return false;
    });

    result.forEach((item) => {
      const studentWorks = item.works.map((work) => String(work.studentId));
      const missedStudentWorks = students.filter(
        (student) => !studentWorks.includes(String(student._id)),
      );

      missedStudentWorks.forEach((student) => {
        item.works.push({
          studentId: student._id,
          studentName: student.name,
          mark: 0,
          avgMark: 0,
        });
      });
    });

    const existingTasks = result.map((item) => String(item.taskId));
    const missedTasksWorks = tasks.filter(
      (task) => !existingTasks.includes(String(task._id)),
    );
    missedTasksWorks.forEach((item) => {
      const missedWorks = students.map((student) => {
        return {
          studentId: student._id,
          studentName: student.name,
          mark: 0,
          avgMark: 0,
        };
      });
      result.push({
        taskId: item._id,
        task: item.name,
        maxMark: item.maxMark,
        works: missedWorks,
      });
    });

    return { data: result, students: students };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/students')
  async deleteStudentsFromCourse(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Body()
    studentsIds: DeleteStudentsDto,
  ): Promise<Course> {
    return this.CourseService.deleteManyStudents(id, studentsIds.students);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me/:id')
  async deleteMySelfFromCourse(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Request() req,
  ): Promise<Course> {
    return this.CourseService.deleteStudent(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteCourse(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<void> {
    try {
      await this.CourseService.deleteCourse(id);
    } catch {
      throw new BadRequestException('Bad request');
    }
  }
}
