import { User } from './../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
@Schema({
  timestamps: true,
})
export class Mark extends Document {
  @Prop()
  mark: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  studentId: User;
}

export const MarkSchema = SchemaFactory.createForClass(Mark);
