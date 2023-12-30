import { CreateCommentDto } from './dto/comment.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comment } from './schema/comment.schema';
@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
  ) {}

  async createComment(
    studentId: mongoose.Schema.Types.ObjectId,
    text: string,
  ): Promise<Comment> {
    const comment = await this.commentModel.create({
      studentId,
      text,
    });

    return comment;
  }

  async updateComment(
    id: mongoose.Schema.Types.ObjectId,
    commentDto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentModel.findByIdAndUpdate(id, commentDto);
    return comment;
  }

  async deleteComment(id: mongoose.Schema.Types.ObjectId): Promise<void> {
    await this.commentModel.findByIdAndDelete(id);
  }
}
