// import { CreateMarkDto } from './dto/mark.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Mark } from './schema/mark.schema';

@Injectable()
export class MarkService {
  constructor(
    @InjectModel(Mark.name)
    private markModel: Model<Mark>,
  ) {}

  async createMark(
    studentId: mongoose.Schema.Types.ObjectId,
    markDto,
  ): Promise<Mark> {
    const mark = await this.markModel.create({
      studentId,
      mark: markDto.mark,
    });

    return mark;
  }
  async updateMark(id: mongoose.Schema.Types.ObjectId, markDto): Promise<Mark> {
    const mark = await this.markModel.findByIdAndUpdate(id, markDto);
    return mark;
  }
}
