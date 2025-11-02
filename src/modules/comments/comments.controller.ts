import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from '../../entity/comment.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
@Controller('comments')
export class CommentsController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly commentsService: CommentsService) {
  }
  @Get()
  findAll() {
    return this.commentsService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.commentsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Body() data: { content: string; movieId: number },
    @Req() req: any,
  ): Promise<Comment> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = req.user as { id: number };
    if (!user.id || isNaN(user.id)) {
      throw new BadRequestException('Invalid user ID in JWT token.');
    }

    if (!data.content || !data.movieId) {
      throw new BadRequestException('Content and movieId are required.');
    }

    return this.commentsService.create({
      content: data.content,
      userId: user.id,
      movieId: data.movieId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateComment(
    @Param('id') id: number,
    @Body() updateData: Partial<Comment>,
    @Req() req: any,
  ): Promise<Comment> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = req.user as { id: number };
    if (!user.id || isNaN(user.id)) {
      throw new BadRequestException('Invalid user ID in JWT token.');
    }

    if (!updateData.content) {
      throw new BadRequestException('Content is required for updating a comment.');
    }

    return this.commentsService.updateByUser(id, user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: number, @Req() req: any): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = req.user as { id: number };
    if (!user.id || isNaN(user.id)) {
      throw new BadRequestException('Invalid user ID in JWT token.');
    }

    return this.commentsService.deleteByUser(id, user.id);
  }


@Delete('/comment/:id')
async deleteComment2(@Param('id') id: number): Promise<void> {
  await this.commentsService.delete(id);
}
  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() data: Partial<Comment>,
  ): Promise<Comment> {
    return this.commentsService.update(id, data);
  }
}

