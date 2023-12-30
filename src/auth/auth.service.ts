import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private ConfigService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const { name, email, password } = signUpDto;

    const invalidUser = await this.userModel.findOne({ email });

    if (invalidUser) {
      throw new BadRequestException('Email is already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const payload = {
      name: user.name,
      email: user.email,
      id: user._id,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.ConfigService.get<string>('JWT_REFRESH_EXPIRES'),
    });

    return {
      user: payload,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Email doesnt exist');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      name: user.name,
      email: user.email,
      id: user._id,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.ConfigService.get<string>('JWT_REFRESH_EXPIRES'),
    });

    return {
      user: payload,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(user: User) {
    const payload = {
      name: user.name,
      email: user.email,
      id: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
