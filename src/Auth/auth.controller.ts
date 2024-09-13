import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: AuthDto): Promise<any> {
    console.log('SignUp DTO:', dto);
    try {
      const result = await this.authService.signUp(dto);
      return result;
    } catch (error) {
      console.error('SignUp Error:', error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(@Body() dto: AuthDto): Promise<any> {
    console.log('SignIn DTO:', dto);
    try {
      const result = await this.authService.signIn(dto);
      return result;
    } catch (error) {
      console.error('SignIn Error:', error);
      throw error;
    }
  }

  @UseGuards(JwtGuard)
  @Post('protected')
  async protectedRoute(@Req() req: Request): Promise<any> {
    console.log('Request User:', req.user);
    return { message: 'Protected route accessed', user: req.user };
  }
}
