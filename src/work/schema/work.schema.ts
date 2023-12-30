import { User } from './../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import mongoose from 'mongoose';
import { Task } from 'src/task/schema/task.schema';

enum Status {
  InProgress = 'In Progress',
  Marked = 'Marked',
  Deleted = 'Deleted',
}

@Schema({
  timestamps: true,
})
export class Work extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  studentId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  taskId: Task;

  @Prop()
  mark: number;

  @Prop()
  description: string;

  @Prop()
  status: Status;

  @Prop()
  publicate: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' })
  fileId;

  @Prop({ type: [{ type: mongoose.Types.ObjectId }], ref: 'Comment' })
  comments: any;

  @Prop({ type: [{ type: mongoose.Types.ObjectId }], ref: 'Mark' })
  marks: any;

  @Prop()
  avgMark: number;
}

export const WorkSchema = SchemaFactory.createForClass(Work);
