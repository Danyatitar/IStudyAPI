import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Response,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto, @Response() res) {
    const data = await this.authService.signUp(signUpDto);
    res
      .cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
      })
      .send(data);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Response() res) {
    const data = await this.authService.login(loginDto);
    res
      .cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
      })
      .send(data);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  async logout(@Response() res) {
    res
      .cookie('refreshToken', '', {
        httpOnly: true,
      })
      .send('Logout successfull');
  }
}
