import { CreateCourseDto, JoinCourseDto } from './dto/course.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Course } from './shemas/course.shema';
import { machineId } from 'node-machine-id';
import { Task } from 'src/task/schema/task.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    teacherId: mongoose.Schema.Types.ObjectId,
  ): Promise<Course> {
    const timestamp = new Date().getTime().toString(32);

    const course = await this.courseModel.create({
      name: createCourseDto.name,
      students: [],
      teacher: teacherId,
      code: timestamp,
    });
    return course;
  }

  async changeName(
    courseDto: CreateCourseDto,
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<Course> {
    const course = await this.courseModel.findByIdAndUpdate(id, courseDto, {
      new: true,
    });
    return course;
  }

  async joinStudent(id: string, joinCourseDto: JoinCourseDto): Promise<Course> {
    const course = await this.courseModel
      .findOne({ code: joinCourseDto.code })
      .populate('teacher');
    if (!course) {
      throw new NotFoundException('Such course doesnt exists');
    }

    if (new mongoose.Types.ObjectId(id).equals(course.teacher._id)) {
      throw new BadRequestException('Teacher cant be a student');
    }

    if (
      course.students.some((item) =>
        item.equals(new mongoose.Types.ObjectId(id)),
      )
    ) {
      throw new BadRequestException('You have already joined a course');
    }
    course.students = [...course.students, new mongoose.Types.ObjectId(id)];
    course.save();
    return course;
  }

  async getMyCourses(id: string): Promise<any> {
    const teacherCourse = await this.courseModel
      .find({
        teacher: new mongoose.Types.ObjectId(id),
      })
      .populate('teacher');
    const studentCourse = await this.courseModel
      .find({
        students: { $in: [new mongoose.Types.ObjectId(id)] },
      })
      .populate('teacher');

    return { teacherCourse, studentCourse };
  }

  async getStudents(id: mongoose.Schema.Types.ObjectId): Promise<Course> {
    const course = await this.courseModel.findById(id).populate('students');
    if (!course) {
      throw new NotFoundException();
    }
    return course;
  }

  async getCourse(
    id: mongoose.Schema.Types.ObjectId,
    userId: string,
  ): Promise<any> {
    const course = await this.courseModel.findById(id);
    let isTeacher = false;
    if (
      new mongoose.Types.ObjectId(String(course.teacher)).equals(
        new mongoose.Types.ObjectId(userId),
      )
    ) {
      isTeacher = true;
    }

    return { course, isTeacher };
  }

  async deleteCourse(id: mongoose.Schema.Types.ObjectId): Promise<void> {
    await this.courseModel.findByIdAndDelete(id);
  }

  async deleteStudent(
    id: mongoose.Schema.Types.ObjectId,
    studentId: mongoose.Schema.Types.ObjectId,
  ): Promise<Course> {
    const course = await this.courseModel.findById(id);

    if (!course.students.some((item) => item.equals(studentId))) {
      throw new BadRequestException('Student didnt join this course');
    }

    course.students = course.students.filter((item) => !item.equals(studentId));
    course.save();

    return course;
  }

  async deleteManyStudents(
    courseId: mongoose.Schema.Types.ObjectId,
    studentIds: string[],
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const studentObjectIds = studentIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    for (const studentId of studentObjectIds) {
      if (!course.students.some((item) => item.equals(studentId))) {
        throw new BadRequestException(
          `Student with ID ${studentId} didn't join this course`,
        );
      }
    }

    course.students = course.students.filter(
      (item) => !studentObjectIds.some((id) => id.equals(item)),
    );

    course.save();
    return course;
  }
}
