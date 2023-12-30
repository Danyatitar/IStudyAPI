import { User } from './../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
@Schema({
  timestamps: true,
})
export class Course extends Document {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId }], ref: 'User' })
  students;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  teacher: User;

  @Prop({ unique: [true, 'Duplicate course code'] })
  code: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
