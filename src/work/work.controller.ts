import { CreateCommentDto } from './../comment/dto/comment.dto';
import { CreateWorkDto, MarkWorkDto, UpdateWorkDto } from './dto/work.dto';
import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { WorkService } from './work.service';
import { CommentService } from 'src/comment/comment.service';
import { MarkService } from 'src/mark/mark.service';
import {
  Delete,
  Get,
  Options,
  Param,
  Patch,
  Put,
  Query,
  Res,
} from '@nestjs/common/decorators';
import mongoose from 'mongoose';
import { Work } from './schema/work.schema';
// import { CreateMarkDto } from 'src/mark/dto/mark.dto';

@Controller('works')
export class WorkController {
  constructor(
    private FileService: FileService,
    private WorkService: WorkService,
    private CommentService: CommentService,
    private MarkService: MarkService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createWork(
    @UploadedFile() file: Express.Multer.File,
    @Body() workDto: CreateWorkDto,
    @Req() req,
  ) {
    if (file) {
      const fileId = await this.FileService.storeFile(file);
      return this.WorkService.createWork(workDto, fileId, req.user.id);
    }
    return this.WorkService.createWork(workDto, null, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/mark')
  async markWork(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Body()
    workDto,
  ) {
    return this.WorkService.markWork(workDto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async getMyWorks(@Req() req, @Body() tasks: { taskIds: string[] }) {
    return this.WorkService.getMyWorksFromTasks(req.user.id, tasks.taskIds);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('all')
  async getAllWorks(@Body() tasks: { taskIds: string[] }) {
    return this.WorkService.getAllWorksFromTasks(tasks.taskIds);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/download')
  async downloadFile(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Res() res,
  ) {
    const work = await this.WorkService.getWorkById(id);
    console.log(work);
    const file = await this.FileService.getFileById(work.fileId._id);
    console.log(file.filename);
    console.log(res.getHeaders());
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    res.setHeader('Content-Type', file.contentType);
    console.log(res.getHeaders());

    file.stream.pipe(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('task/:id')
  async getWorksByTask(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
  ) {
    const works = this.WorkService.getWorksByTask(id);
    return works;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/decline')
  async declineWorkSending(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
  ) {
    const works = this.WorkService.declineSending(id);
    return works;
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  async updateWork(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @Body() workDto: UpdateWorkDto,
    @Req() req,
  ) {
    if (file) {
      const oldFile = await this.WorkService.getWorkById(id);
      if (oldFile.fileId) {
        await this.FileService.deleteFileById(oldFile.fileId._id);
      }

      const fileId = await this.FileService.storeFile(file);
      return this.WorkService.updateWork(id, fileId, workDto);
    }
    return this.WorkService.updateWork(id, null, workDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('publications/:id')
  async getPublicationsByUser(
    @Query('courseId')
    courseId: mongoose.Schema.Types.ObjectId,
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Req() req,
  ) {
    const works = this.WorkService.getStudentsPublications(id, courseId);
    return works;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('comments/:id')
  async createComment(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Req() req,
    @Body() commentDto: CreateCommentDto,
  ): Promise<Work> {
    const comment = await this.CommentService.createComment(
      req.user.id,
      commentDto.text,
    );
    const work = await this.WorkService.addComment(comment._id, id);
    return work;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('comments/:id')
  async updateComment(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Query('commentId')
    commentId: mongoose.Schema.Types.ObjectId,
    @Req() req,
    @Body() commentDto: CreateCommentDto,
  ): Promise<Work> {
    const comment = await this.CommentService.updateComment(
      commentId,
      commentDto,
    );

    const work = await this.WorkService.getWorkByIdWithComments(id);
    return work;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('comments/:id')
  async deleteComment(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Query('commentId')
    commentId: mongoose.Schema.Types.ObjectId,
    @Req() req,
  ): Promise<Work> {
    await this.CommentService.deleteComment(commentId);

    const work = await this.WorkService.deleteComment(commentId, id);
    return work;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('marks/:id')
  async addMark(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Req() req,
    @Body() markDto,
  ): Promise<Work> {
    const mark = await this.MarkService.createMark(req.user.id, markDto);
    const work = await this.WorkService.markByStudent(mark, id);
    return work;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('marks/:id')
  async updateMark(
    @Param('id')
    id: mongoose.Schema.Types.ObjectId,
    @Query('markId')
    markId: mongoose.Schema.Types.ObjectId,
    @Req() req,
    @Body() markDto,
  ): Promise<Work> {
    const mark = await this.MarkService.updateMark(markId, markDto);

    const work = await this.WorkService.updateAverageMark(id);
    return work;
  }
  // @UseGuards(AuthGuard('jwt'))
  // @Patch(':id/markByStudent')
  // async markWorkByStudent(
  //   @Param('id')
  //   id: mongoose.Schema.Types.ObjectId,
  //   @Body()
  //   workDto: MarkWorkDto,
  // ) {
  //   return this.WorkService.markWorkByStudent(workDto, id);
  // }
}
