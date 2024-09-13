import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    PassportModule,

    JwtModule.register({
      // imports: [ConfigModule],
      // inject: [ConfigService],
      // useFactory: async (configService: ConfigService) => ({
      //   secret: configService.get<string>('JWT_SECRET'),
      //   signOptions: { expiresIn: '60m' },
      // }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
