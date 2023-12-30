import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/user.dto';
import mongoose from 'mongoose';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findById(id: mongoose.Schema.Types.ObjectId): Promise<User> {
    return await this.userModel.findById(id);
  }

  async updateName(
    id: mongoose.Schema.Types.ObjectId,
    userDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userModel.findOneAndUpdate({ _id: id }, userDto, {
        new: true,
      });
      return user;
    } catch (e) {
      throw new BadRequestException('Invalid id');
    }
  }
}
