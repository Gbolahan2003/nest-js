import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from '../Auth/auth.module';
import { UserService } from './user.service';
import { JwtStrategy } from '../Auth/strategy';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, ConfigModule, PrismaModule, PassportModule, JwtModule.register({})],
  providers: [JwtStrategy, UserService],
  controllers: [UserController],
})
export class UserModule {}
