import { MarkService } from './../mark/mark.service';
import { CommentService } from './../comment/comment.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { FileService } from 'src/file/file.service';
import { UserSchema } from 'src/user/schemas/user.schema';
import { WorkSchema } from './schema/work.schema';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { CommentSchema } from 'src/comment/schema/comment.schema';
import { MarkSchema } from 'src/mark/schema/mark.schema';

const DummyFileSchema = new mongoose.Schema({});

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Mark', schema: MarkSchema }]),
    MongooseModule.forFeature([
      { name: 'Work', schema: WorkSchema },
      { name: 'fs.files', schema: DummyFileSchema, collection: 'fs.files' },
    ]),
  ],
  controllers: [WorkController],
  providers: [WorkService, FileService, CommentService, MarkService],
})
export class WorkModule {}
