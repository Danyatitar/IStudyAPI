import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/user/schemas/user.schema';

import { CommentService } from './comment.service';
import { CommentSchema } from './schema/comment.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
  ],
  controllers: [],
  providers: [CommentService],
})
export class CommentModule {}
