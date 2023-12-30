import { UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Body,
  Request,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { User } from './schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
@Controller('users')
export class UserController {
  constructor(private UserService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUser(@Request() req): Promise<User> {
    return this.UserService.findById(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async updateUser(
    @Body()
    user: UpdateUserDto,
    @Request() req,
  ): Promise<User> {
    return this.UserService.updateName(req.user.id, user);
  }
}
