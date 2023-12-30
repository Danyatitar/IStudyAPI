import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { FileModule } from './file/file.module';
import { TaskModule } from './task/task.module';
import { WorkModule } from './work/work.module';
import { CommentModule } from './comment/comment.module';
import { MarkModule } from './mark/mark.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    UserModule,
    CourseModule,
    FileModule,
    TaskModule,
    WorkModule,
    CommentModule,
    MarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
