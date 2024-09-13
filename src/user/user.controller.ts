import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { GetUser } from '../Auth/decarators/getUser.decorator';
import { JwtGuard } from '../Auth/guards';
import { editUser } from './dto/edit-user';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getme(@GetUser() user: User) {
    return user;
  }
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: editUser) {
    return this.userService.editUser(userId, dto);
  }
}
