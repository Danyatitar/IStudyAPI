import { User } from './../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import mongoose from 'mongoose';
import { Course } from 'src/course/shemas/course.shema';
@Schema({
  timestamps: true,
})
export class Task extends Document {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: Course;

  @Prop()
  maxMark: number;

  @Prop()
  description: string;

  @Prop()
  allowPublication: boolean;

  @Prop({ type: Date })
  deadline: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' })
  fileId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
