import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  BadRequestException,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  NotFoundException,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from '../../entity/movie.entity';
import { Review } from '../../entity/review.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from '../Cloundinary/cloudinary-storage';

@Controller('movies')
export class MoviesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly moviesService: MoviesService) {}

  // ===== SPECIFIC ROUTES FIRST =====
// @Get()
// async getAllMovies1() {
//   return this.moviesService.findAll();
// }
// Sửa trong MoviesController
@Get()
async getAllMovies(
  @Query('page') page: number = 1,
  @Query('size') size: number = 10,
  @Query('sort') sort: string = 'id:DESC',
) {
  const validatedPage = Math.max(1, Number(page));
  
  // ✅ SỬA: Nếu size=0, trả về TẤT CẢ phim (không phân trang)
  if (Number(size) === 0) {
    const movies = await this.moviesService.getAllMoviesWithoutPagination(sort);
    return {
      movies: movies,
      total: movies.length,
      page: 1,
      size: movies.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
  
  const validatedSize = Math.max(1, Math.min(100, Number(size)));
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return this.moviesService.getAllMovies(validatedPage, validatedSize, sort);
}
// Thêm vào ReviewsController - đặt TRƯỚC @Get(':id')
@Get('count')
async getCountMovies() {
  return await this.moviesService.getCountMovies();
}
@Get('movie/:movieId')
async findByMovieId(@Param('movieId') movieId: number): Promise<Review[]> {
  const validatedMovieId = Number(movieId);
  
  if (isNaN(validatedMovieId)) {
    throw new BadRequestException('Invalid movie ID');
  }
  
  // ✅ THÊM await vì method này là async
  return await this.moviesService.findByMovieId(validatedMovieId);
}
  // GET /movies/all - Lấy TẤT CẢ phim (không phân trang)
  @Get('all')
  async getAllMoviesWithoutPagination(@Query('sort') sort: string = 'id:DESC') {
    const movies = await this.moviesService.getAllMoviesWithoutPagination(sort);
    
    return {
      movies: movies,
      total: movies.length,
      page: 1,
      size: movies.length,
      totalPages: 1,
    };
  }

  // GET /movies/all-with-limit - Lấy tất cả phim với limit tùy chọn
  @Get('all-with-limit')
  async getAllMoviesWithLimit(
    @Query('limit') limit?: number,
    @Query('sort') sort: string = 'id:DESC',
  ) {
    const validatedLimit = limit && limit > 0 ? Math.min(limit, 1000) : undefined;
    const movies = await this.moviesService.getAllMoviesWithLimit(validatedLimit, sort);
    
    return {
      movies: movies,
      total: movies.length,
      limit: validatedLimit,
      sort: sort,
    };
  }

  // GET /movies/search - Tìm kiếm phim nâng cao
  // GET /movies/search - Version đơn giản (KHÔNG validation strict)
@Get('search')
async searchMovies(
  @Query('title') title?: string,
  @Query('genreId') genreId?: number,
  @Query('page') page: number = 1,
  @Query('size') size: number = 10,
  @Query('sort') sort: string = 'id:DESC',
) {
  const validatedPage = Math.max(1, Number(page));
  const validatedSize = Math.max(1, Math.min(100, Number(size)));
  const validatedGenreId = genreId ? Number(genreId) : undefined;

  // ✅ Clean title
  const cleanTitle = title?.trim() || undefined;

  // ✅ KHÔNG validation - cho phép search linh hoạt
  console.log('Search params:', {
    title: cleanTitle,
    genreId: validatedGenreId,
    page: validatedPage,
    size: validatedSize
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return this.moviesService.searchMoviesAdvanced(
    cleanTitle,
    validatedGenreId,
    validatedPage,
    validatedSize,
    sort
  );
}

  // GET /movies/new - Lấy phim mới nhất
  @Get('new')
  async getNewMovies(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('sort') sort: string = 'created_at:DESC',
  ) {
    const validatedPage = Math.max(1, Number(page));
    const validatedSize = Math.max(1, Math.min(100, Number(size)));
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.moviesService.getNewMovies(validatedPage, validatedSize, sort);
  }

  // GET /movies/top - Lấy phim trending
 @Get('top')
async getTopMovies() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return this.moviesService.getTopMovies();
}


  // GET /movies/genre/:id - Lấy phim theo thể loại
  @Get('genre/:id')
  async getMoviesByGenre(
    @Param('id', ParseIntPipe) genreId: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('sort') sort: string = 'id:DESC',
  ) {
    const validatedPage = Math.max(1, Number(page));
    const validatedSize = Math.max(1, Math.min(100, Number(size)));
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.moviesService.getMoviesByGenre(genreId, validatedPage, validatedSize, sort);
  }

  // GET /movies/by-genre/:id - Alias cho genre endpoint
  @Get('by-genre/:id')
  async getMoviesByGenreAlias(
    @Param('id', ParseIntPipe) genreId: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('sort') sort: string = 'id:DESC',
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.getMoviesByGenre(genreId, page, size, sort);
  }

  // GET /movies/by-country/:country - Lấy phim theo quốc gia
  @Get('by-country/:country')
  async getMoviesByCountry(
    @Param('country') country: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('sort') sort: string = 'id:DESC',
  ) {
    const validatedPage = Math.max(1, Number(page));
    const validatedSize = Math.max(1, Math.min(100, Number(size)));
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.moviesService.getMoviesByCountry(country, validatedPage, validatedSize, sort);
  }

  // GET /movies/related/:id - Lấy phim liên quan
  @Get('related/:id')
  async getRelatedMovies(
    @Param('id', ParseIntPipe) movieId: number,
    @Query('limit') limit: number = 6
  ) {
    const validatedLimit = Math.max(1, Math.min(20, Number(limit)));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.moviesService.getRelatedMovies(movieId, validatedLimit);
  }

  // GET /movies/popular - Lấy phim phổ biến
  @Get('popular')
  async getPopularMovies(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    const validatedPage = Math.max(1, Number(page));
    const validatedSize = Math.max(1, Math.min(100, Number(size)));
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.moviesService.getPopularMovies(validatedPage, validatedSize);
  }

  // GET /movies/trending - Lấy phim trending (alias cho top)
 

  // ===== GENERIC ROUTES =====

  // GET /movies - Lấy danh sách phim với phân trang
  

  // GET /movies/:id - Lấy chi tiết phim
  @Get(':id')
  async getMovie(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  // ===== CRUD OPERATIONS =====

  // POST /movies - Tạo phim mới
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMovie(@Body() movieData: Partial<Movie>) {
    // Validate required fields
    if (!movieData.title) {
      throw new BadRequestException('Title is required');
    }

    if (!movieData.slug) {
      // Auto generate slug from title if not provided
      movieData.slug = movieData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    return this.moviesService.create(movieData);
  }

  // PUT /movies/:id - Cập nhật phim
  @Put(':id')
  async updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Movie>
  ) {
    // Validate if movie exists
    await this.moviesService.findOne(id);
    
    return this.moviesService.update(id, updateData);
  }

  // DELETE /movies/:id - Xóa phim
  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteMovie(@Param('id', ParseIntPipe) id: number) {
  //   // Validate if movie exists
  //   await this.moviesService.findOne(id);

  //   await this.moviesService.remove(id);
  //   return { message: 'Movie deleted successfully' };
  // }
@Delete(':id')
@HttpCode(HttpStatus.OK)
async deleteMovie(@Param('id', ParseIntPipe) id: number) {
  await this.moviesService.findOne(id);
  await this.moviesService.remove(id);
  return { message: 'Xoá phim thành công' };
}


  // POST /movies/:id/view - Tăng lượt xem
  @Post(':id/view')
  @HttpCode(HttpStatus.OK)
  async incrementViews(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.incrementViews(id);
  }

  // GET /movies/stats/summary - Thống kê tổng quan
  @Get('stats/summary')
  async getMovieStats() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.moviesService.getMovieStatistics();
  }


// Thêm vào MoviesController
@Get('feedback/:movieId')
async getMovieFeedback(@Param('movieId', ParseIntPipe) movieId: number) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await this.moviesService.getCommentsAndReviewsByMovieId(movieId);
}


@Get('slug/:slug')
async getMovieBySlug(@Param('slug') slug: string) {
  const movie = await this.moviesService.findMovieByGenreSlug(slug);
  
  if (!movie) {
    throw new NotFoundException(`Movie with slug "${slug}" not found`);
  }
  
  return movie;
}
 @Post('upload-images')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'poster', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
      ],
      { storage },
    ),
  )
  uploadImages(
    @UploadedFiles()
    files: { poster?: Express.Multer.File[]; banner?: Express.Multer.File[] },
  ) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      poster_url: files.poster ? files.poster[0].path : null,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      banner_url: files.banner ? files.banner[0].path : null,
    };
  }
}