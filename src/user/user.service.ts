import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { editUser } from './dto/edit-user';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async editUser(userId: number, dto: editUser) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.hash;
    return user;
  }
}
