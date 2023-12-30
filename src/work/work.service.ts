import { Mark } from './../mark/schema/mark.schema';
import { FileService } from './../file/file.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Work } from './schema/work.schema';
import { CreateWorkDto, MarkWorkDto, UpdateWorkDto } from './dto/work.dto';

@Injectable()
export class WorkService {
  constructor(
    @InjectModel(Work.name)
    private workModel: Model<Work>,
  ) {}

  async createWork(
    workDto: CreateWorkDto,
    fileId: string,
    studentId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work> {
    let publicate = true;
    if (workDto.publicate === 'false') {
      publicate = false;
    }
    const work = await this.workModel.create({
      studentId,
      taskId: new mongoose.Types.ObjectId(workDto.taskId),
      publicate: publicate,
      description: workDto.description,
      fileId,
      comments: [],
      marks: [],
      avgMark: 0,
      status: 'In Progress',
    });
    return work;
  }

  async markWork(
    workDto: MarkWorkDto,
    workId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work> {
    const work = await this.workModel.findByIdAndUpdate(workId, {
      ...workDto,
      status: 'Marked',
    });
    return (await work.populate('studentId')).populate('fileId');
  }

  async getWorkById(workId: mongoose.Schema.Types.ObjectId): Promise<Work> {
    const work = await this.workModel.findById(workId).populate('fileId');

    return work;
  }

  async getMyWorksFromTasks(
    studentId: mongoose.Schema.Types.ObjectId,
    taskIds: string[],
  ): Promise<Work[]> {
    // Convert taskIds to mongoose.Types.ObjectId
    const objectIdTaskIds = taskIds.map(
      (taskId) => new mongoose.Types.ObjectId(taskId),
    );

    const works = await this.workModel
      .find({ studentId: studentId, taskId: { $in: objectIdTaskIds } })
      .populate('fileId');

    return works;
  }

  async getAllWorksFromTasks(taskIds: string[]): Promise<Work[]> {
    // Convert taskIds to mongoose.Types.ObjectId
    const objectIdTaskIds = taskIds.map(
      (taskId) => new mongoose.Types.ObjectId(taskId),
    );

    const works = await this.workModel
      .find({ taskId: { $in: objectIdTaskIds } })
      .populate('fileId');

    return works;
  }

  async getWorksByTask(
    taskId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work[]> {
    const works = await this.workModel
      .find({ taskId: taskId })
      .populate('studentId')
      .populate('fileId');

    return works;
  }

  async getWorksByCourse(
    courseId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work[]> {
    const works = await this.workModel
      .find()
      .populate({
        path: 'taskId',
        match: { courseId: courseId },
      })
      .populate('studentId');
    const filteredWorks = works.filter((work) => work.taskId);

    return filteredWorks;
  }

  async declineSending(workId: mongoose.Schema.Types.ObjectId): Promise<Work> {
    const work = await this.workModel.findByIdAndUpdate(
      workId,
      { status: 'Deleted' },
      { new: true },
    );
    return work;
  }

  async updateWork(
    workId: mongoose.Schema.Types.ObjectId,
    fileId: string,
    updateWorkDto: UpdateWorkDto,
  ): Promise<Work> {
    if (fileId) {
      const work = await this.workModel.findByIdAndUpdate(
        workId,
        { ...updateWorkDto, status: 'In Progress', fileId: fileId },
        {
          new: true,
        },
      );
      return work.populate('fileId');
    }
    const work = await this.workModel.findByIdAndUpdate(
      workId,
      { ...updateWorkDto, status: 'In Progress' },
      {
        new: true,
      },
    );
    return work.populate('fileId');
  }

  async getStudentsPublications(
    studentId: mongoose.Schema.Types.ObjectId,
    courseId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work[]> {
    const publications = await this.workModel
      .find({ publicate: true, studentId: studentId })
      .populate('studentId')
      .populate('fileId')
      .populate({
        path: 'marks',
        populate: {
          path: 'studentId',
        },
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'studentId',
        },
      })
      .populate({
        path: 'taskId',
        match: { courseId: courseId },
      });
    const filteredPublications = publications.filter(
      (publication) => publication.taskId,
    );

    return filteredPublications;
  }

  async addComment(
    commentId: mongoose.Schema.Types.ObjectId,
    workId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work> {
    const work = await this.workModel.findById(workId);

    work.comments.push(commentId);
    work.save();
    return (
      await (
        await (
          await (
            await work.populate({
              path: 'comments',
              populate: {
                path: 'studentId',
              },
            })
          ).populate('studentId')
        ).populate('fileId')
      ).populate('taskId')
    ).populate({
      path: 'marks',
      populate: {
        path: 'studentId',
      },
    });
  }

  async getWorkByIdWithComments(
    workId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work> {
    const work = await this.workModel
      .findById(workId)
      .populate('studentId')
      .populate('fileId')
      .populate('taskId')
      .populate({
        path: 'comments',
        populate: {
          path: 'studentId',
        },
      })
      .populate({
        path: 'marks',
        populate: {
          path: 'studentId',
        },
      });

    return work;
  }

  async deleteComment(
    commentId: mongoose.Schema.Types.ObjectId,
    workId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work> {
    const work = await this.workModel.findById(workId);

    work.comments = work.comments.filter((item) => item._id !== commentId);
    work.save();
    return (
      await (
        await (
          await (
            await work.populate({
              path: 'comments',
              populate: {
                path: 'studentId',
              },
            })
          ).populate('studentId')
        ).populate('fileId')
      ).populate('taskId')
    ).populate({
      path: 'marks',
      populate: {
        path: 'studentId',
      },
    });
  }

  async markByStudent(
    mark: Mark,
    workId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work> {
    const work = await this.workModel.findById(workId).populate('marks');
    work.marks.push(mark);
    let sumMark = 0;
    work.marks.forEach((mark) => {
      sumMark += mark.mark;
    });
    work.avgMark = sumMark / work.marks.length;

    work.save();

    return (
      await (
        await (
          await (
            await work.populate({
              path: 'comments',
              populate: {
                path: 'studentId',
              },
            })
          ).populate('studentId')
        ).populate('fileId')
      ).populate('taskId')
    ).populate({
      path: 'marks',
      populate: {
        path: 'studentId',
      },
    });
  }

  async updateAverageMark(
    workId: mongoose.Schema.Types.ObjectId,
  ): Promise<Work> {
    const work = await this.workModel.findById(workId).populate('marks');

    let sumMark = 0;
    work.marks.forEach((mark) => {
      sumMark += mark.mark;
    });

    work.avgMark = sumMark / work.marks.length;
    work.save();

    return (
      await (
        await (
          await (
            await work.populate({
              path: 'comments',
              populate: {
                path: 'studentId',
              },
            })
          ).populate('studentId')
        ).populate('fileId')
      ).populate('taskId')
    ).populate({
      path: 'marks',
      populate: {
        path: 'studentId',
      },
    });
  }
}
