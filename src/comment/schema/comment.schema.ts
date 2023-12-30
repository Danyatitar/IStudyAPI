import { User } from './../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
@Schema({
  timestamps: true,
})
export class Comment extends Document {
  @Prop()
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  studentId: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
