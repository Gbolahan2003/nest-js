import { ForbiddenException, Injectable } from '@nestjs/common';
import { createBookmarkDto, editBookmarkDto } from './dto/bookmark-dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async createBookMark(userId: number, dto: createBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        title: dto.title,
        description: dto.description || '', // Ensure description is always provided
        link: dto.link,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return bookmark;
  }

  async getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userID: userId,
      },
    });
  }

  getBookMarkById(userId: number, bookMarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookMarkId,
        userID: userId,
      },
    });
  }

  async editBookmarkById(userId: number, bookMarkId: number, dto: editBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookMarkId,
      },
    });

    if (!bookmark || bookmark.userID !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.prisma.bookmark.update({
      where: {
        id: bookMarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookMarkById(userId: number, bookMarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookMarkId,
      },
    });

    if (!bookmark || bookmark.userID !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.prisma.bookmark.delete({
      where: {
        id: bookMarkId,
      },
    });
  }
}
