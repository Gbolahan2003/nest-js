import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../Auth/guards';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../Auth/decarators/getUser.decorator';
import { createBookmarkDto, editBookmarkDto } from './dto/bookmark-dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookMarkService: BookmarkService) {}

  @Post()
  createBookMark(@GetUser('id') userId: number, @Body() dto: createBookmarkDto) {
    return this.bookMarkService.createBookMark(userId, dto);
  }

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookMarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookMarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookMarkService.getBookMarkById(userId, bookmarkId);
  }

  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Body() dto: editBookmarkDto,
    @Param('id', ParseIntPipe) bookMarkId: number
  ) {
    return this.bookMarkService.editBookmarkById(userId, bookMarkId, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookMarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookMarkId: number) {
    return this.bookMarkService.deleteBookMarkById(userId, bookMarkId);
  }
}
