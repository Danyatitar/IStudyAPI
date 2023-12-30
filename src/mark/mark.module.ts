import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/user/schemas/user.schema';

import { MarkService } from './mark.service';
import { MarkSchema } from './schema/mark.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Mark', schema: MarkSchema }]),
  ],
  controllers: [],
  providers: [MarkService],
})
export class MarkModule {}
