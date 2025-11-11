import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Favorite } from '../../entity/favorite.entity';


@Controller('favorites')
export class FavoritesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly favoritesService: FavoritesService) {}
  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }
  // @Delete(':id')
  // async deleteFavorite(@Param('id') id: number): Promise<void> {
  //   // tra ve void khi xóa thành công
  //   if (!id) {
  //     throw new Error('ID is required to delete a favorite.');
  //   }
  //   // Gọi service để xóa mục yêu thích
  //   const favorite = await this.favoritesService.findAll();
  //   if (!favorite) {
  //     throw new Error(`Favorite with ID ${id} does not exist.`);
  //   }
  //   return this.favoritesService.deleteFavorite(id);
  // }
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: number) {
    // Tìm tất cả mục yêu thích của người dùng theo ID
    if (!userId) {
      throw new Error('User ID is required to find favorites.');
    }
    return this.favoritesService.findByUserId(userId);
  }

  // @UseGuards(JwtAuthGuard)
  //   @Delete('remove')
  // async remove(@Req() req, @Body('movieId') movieId: number): Promise<{ message: string }> {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //   const userId = req.user.sub; // lấy từ JWT
  //   if (!movieId) throw new BadRequestException('movieId is required.');
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //   return this.favoritesService.remove(userId, movieId);
  // }
    @Get('get-favorite-movie/:userId')
  async getFavoriteMovies(@Param('userId', ParseIntPipe) userId: number) {
    const movieIds = await this.favoritesService.getFavoriteMovieIds(userId);
    return movieIds;
  }
  // @UseGuards(JwtAuthGuard)
  // @Post('add')
  // async add(
  //   @Req() req,
  //   @Body('movieId') movieId: number,
  // ): Promise<Favorite> {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  //   const userId = req.user.sub;
  //   if (!movieId) {
  //     throw new BadRequestException('movieId is required.');
  //   }
  //   return this.favoritesService.add(userId, movieId);
  // }
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(@Req() req, @Body('movieId') movieId: number): Promise<Favorite> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log("👤 user payload trong JWT:", req.user);
 // Lấy userId từ JWT
    if (!movieId) {
      throw new BadRequestException('movieId is required.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.favoritesService.add(userId, movieId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('remove/:movieId')
  async remove(
    @Req() req,
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<{ message: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const userId = req.user.sub;
    return this.favoritesService.remove(userId, movieId);
  }




}
