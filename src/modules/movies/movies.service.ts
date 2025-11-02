import { Injectable, NotFoundException, BadRequestException, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../../entity/movie.entity';
import { Review } from '../../entity/review.entity';
import { Comment } from '../../entity/comment.entity';
import { Genre } from '../../entity/genre.entity';
import { Favorite } from '@src/entity/favorite.entity';
@Injectable()
export class MoviesService {
  constructor(
  // eslint-disable-next-line prettier/prettier
  @InjectRepository(Movie) private moviesRepository: Repository<Movie>,
  @InjectRepository(Favorite) private favoriteRepository: Repository<Favorite>,
  @InjectRepository(Review) private reviewsRepository: Repository<Review>,
  @InjectRepository(Genre) private genreRepository: Repository<Genre>,
  @InjectRepository(Comment) private commentsRepository: Repository<Comment>, // index [2]
) {}


  // ===== SEARCH & FILTER METHODS =====
  @Get()
  findAll(){
    return this.moviesRepository.find();
  }
 
async searchMoviesAdvanced(
  title?: string,
  genreId?: number,
  page: number = 1,
  size: number = 10,
  sort: string = 'id:DESC'
): Promise<any> {
  try {
    const [sortField, sortDirection] = this.parseSortParameter(sort);

    let queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre');

    // Build WHERE conditions
    const whereConditions: string[] = [];
    const parameters: any = {};

    // Add title search condition - CHỈ khi có title
    if (title && title.length > 0) {
      whereConditions.push(
        '(movie.title LIKE :title OR movie.original_title LIKE :title OR movie.description LIKE :title)'
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      parameters.title = `%${title}%`;
    }

    // Add genre filter condition - CHỈ khi có genreId
    if (genreId && genreId > 0) {
      whereConditions.push('genre.id = :genreId');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      parameters.genreId = genreId;
    }

    // ✅ Apply WHERE clause - CHỈ khi có conditions
    if (whereConditions.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      queryBuilder = queryBuilder.where(whereConditions.join(' AND '), parameters);
    }
    // ✅ Nếu không có điều kiện, không thêm WHERE - sẽ lấy tất cả phim

    // Add sorting
    queryBuilder = queryBuilder.orderBy(`movie.${sortField}`, sortDirection);

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const movies = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .getMany();

    const totalPages = Math.ceil(total / size);

    return {
      movies,
      total,
      page,
      size,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

  } catch (error) {
    console.error('Search error:', error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new BadRequestException(`Error in advanced search: ${error.message}`);
  }
}
  // Lấy phim theo thể loại
  async getMoviesByGenre(
    genreId: number,
    page: number = 1,
    size: number = 10,
    sort: string = 'id:DESC'
  ): Promise<any> {
    try {
      const [sortField, sortDirection] = this.parseSortParameter(sort);

      const queryBuilder = this.moviesRepository
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.genres', 'genre')
        .where('genre.id = :genreId', { genreId })
        .orderBy(`movie.${sortField}`, sortDirection);

      const total = await queryBuilder.getCount();

      const movies = await queryBuilder
        .skip((page - 1) * size)
        .take(size)
        .getMany();

      const totalPages = Math.ceil(total / size);

      return {
        movies,
        total,
        page,
        size,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error fetching movies by genre: ${error.message}`);
    }
  }

  // Lấy phim theo quốc gia
  async getMoviesByCountry(
    country: string,
    page: number = 1,
    size: number = 10,
    sort: string = 'id:DESC'
  ): Promise<any> {
    try {
      const [sortField, sortDirection] = this.parseSortParameter(sort);

      const queryBuilder = this.moviesRepository
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.genres', 'genre')
        .where('movie.country LIKE :country', { country: `%${country}%` })
        .orderBy(`movie.${sortField}`, sortDirection);

      const total = await queryBuilder.getCount();

      const movies = await queryBuilder
        .skip((page - 1) * size)
        .take(size)
        .getMany();

      const totalPages = Math.ceil(total / size);

      return {
        movies,
        total,
        page,
        size,
        totalPages,
      };

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error fetching movies by country: ${error.message}`);
    }
  }

  // ===== LIST METHODS =====

  // Lấy tất cả phim (không phân trang)
  async getAllMoviesWithoutPagination(sort: string = 'id:DESC'): Promise<Movie[]> {
    try {
      const [sortField, sortDirection] = this.parseSortParameter(sort);

      return await this.moviesRepository.find({
        relations: ['genres'],
        order: { [sortField]: sortDirection },
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error retrieving all movies: ${error.message}`);
    }
  }

  // Lấy tất cả phim với limit
  async getAllMoviesWithLimit(limit?: number, sort: string = 'id:DESC'): Promise<Movie[]> {
    try {
      const [sortField, sortDirection] = this.parseSortParameter(sort);

      const queryOptions: any = {
        relations: ['genres'],
        order: { [sortField]: sortDirection },
      };

      if (limit && limit > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        queryOptions.take = limit;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return await this.moviesRepository.find(queryOptions);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error retrieving movies with limit: ${error.message}`);
    }
  }

  // Lấy danh sách phim với phân trang
 // Thêm method getAllMovies vào MoviesService
async getAllMovies(page: number, size: number, sort: string): Promise<any> {
  try {
    const [sortField, sortDirection] = this.parseSortParameter(sort);

    const queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .orderBy(`movie.${sortField}`, sortDirection);

    const total = await queryBuilder.getCount();

    const movies = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .getMany();

    const totalPages = Math.ceil(total / size);

    return {
      movies, // ✅ Key này khớp với frontend expectation
      total,
      page,
      size,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new BadRequestException(`Error fetching movies: ${error.message}`);
  }
}

// Thêm method parseSortParameter nếu chưa có


  // Lấy phim mới nhất
  async getNewMovies(page: number = 1, size: number = 10, sort: string = 'created_at:DESC'): Promise<any> {
    try {
      const [sortField, sortDirection] = this.parseSortParameter(sort);

      const queryBuilder = this.moviesRepository
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.genres', 'genre')
        .orderBy(`movie.${sortField}`, sortDirection);

      const total = await queryBuilder.getCount();

      const movies = await queryBuilder
        .skip((page - 1) * size)
        .take(size)
        .getMany();

      const totalPages = Math.ceil(total / size);

      return {
        movies,
        total,
        page,
        size,
        totalPages,
      };

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error fetching new movies: ${error.message}`);
    }
  }

 

  // Lấy phim phổ biến
  async getPopularMovies(page: number = 1, size: number = 10): Promise<any> {
    try {
      const queryBuilder = this.moviesRepository
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.genres', 'genre')
        .where('movie.views > :minViews', { minViews: 100 })
        .orderBy('movie.views', 'DESC')
        .addOrderBy('movie.rating', 'DESC');

      const total = await queryBuilder.getCount();

      const movies = await queryBuilder
        .skip((page - 1) * size)
        .take(size)
        .getMany();

      const totalPages = Math.ceil(total / size);

      return {
        movies,
        total,
        page,
        size,
        totalPages,
      };

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error fetching popular movies: ${error.message}`);
    }
  }

  // Lấy phim liên quan
  async getRelatedMovies(movieId: number, limit: number = 6): Promise<any> {
    try {
      // Lấy thông tin phim gốc
      const originalMovie = await this.moviesRepository.findOne({
        where: { id: movieId },
        relations: ['genres'],
      });

      if (!originalMovie) {
        throw new NotFoundException(`Movie with ID ${movieId} not found`);
      }

      // Lấy IDs của các genres
      const genreIds = originalMovie.genres.map(genre => genre.id);

      if (genreIds.length === 0) {
        // Nếu không có genre, lấy phim random
        const movies = await this.moviesRepository
          .createQueryBuilder('movie')
          .leftJoinAndSelect('movie.genres', 'genre')
          .where('movie.id != :movieId', { movieId })
          .orderBy('RANDOM()')
          .take(limit)
          .getMany();

        return { movies, total: movies.length };
      }

      // Lấy phim có chung genre
      const movies = await this.moviesRepository
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.genres', 'genre')
        .where('movie.id != :movieId', { movieId })
        .andWhere('genre.id IN (:...genreIds)', { genreIds })
        .orderBy('movie.rating', 'DESC')
        .addOrderBy('movie.views', 'DESC')
        .take(limit)
        .getMany();

      return {
        movies,
        total: movies.length,
        relatedBy: 'genre',
      };

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error fetching related movies: ${error.message}`);
    }
  }

  // ===== CRUD METHODS =====

  // Tìm phim theo ID
  async findOne(id: number): Promise<Movie> {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id },
        relations: ['genres', 'episodes', 'comments', 'reviews'],
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }

      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error finding movie: ${error.message}`);
    }
  }

  // Tạo phim mới
  async create(movieData: Partial<Movie>): Promise<Movie> {
    try {
      const movie = this.moviesRepository.create({
        ...movieData,
        views: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.moviesRepository.save(movie);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error creating movie: ${error.message}`);
    }
  }

  // Cập nhật phim
  // async update(id: number, updateData: Partial<Movie>): Promise<Movie> {
  //   try {
  //     await this.moviesRepository.update(id, {
  //       ...updateData,
  //       updated_at: new Date(),
  //     });
  //
  //     return this.findOne(id);
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new BadRequestException(`Error updating movie: ${error.message}`);
  //   }
  // }
  async update(id: number, updateData: Partial<Movie>): Promise<Movie> {
    try {
      // lấy movie hiện tại
      const movie = await this.moviesRepository.findOne({
        where: { id },
        relations: ['genres'], // load luôn genres cũ
      });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }

      // nếu có genres trong updateData thì load lại từ DB
      if (updateData.genres) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
        const genreIds = updateData.genres.map((g: any) => g.id || g);
        const genres = await this.genreRepository.findByIds(genreIds);
        movie.genres = genres;
      }

      // merge các field khác
      Object.assign(movie, {
        ...updateData,
        updated_at: new Date(),
      });

      // save lại (TypeORM sẽ tự xử lý bảng join cho ManyToMany)
      return await this.moviesRepository.save(movie);
    } catch (error) {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error updating movie: ${error.message}`,
      );
    }
  }

  // Xóa phim
  // async remove(id: number): Promise<void> {
  //   try {
  //     const result = await this.moviesRepository.delete(id);
      
  //     if (result.affected === 0) {
  //       throw new NotFoundException(`Movie with ID ${id} not found`);
  //     }
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new BadRequestException(`Error deleting movie: ${error.message}`);
  //   }
  // }
async remove(id: number): Promise<void> {
  try {
    // Xóa các bản ghi favorite liên quan
    await this.favoriteRepository.delete({ movie: { id } });

    // Sau đó mới xóa movie
    const result = await this.moviesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new BadRequestException(`Error deleting movie: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

  // Tăng lượt xem
  async incrementViews(id: number): Promise<Movie> {
    try {
      await this.moviesRepository.increment({ id }, 'views', 1);
      return this.findOne(id);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error incrementing views: ${error.message}`);
    }
  }

  // ===== UTILITY METHODS =====

  // Thống kê phim
  async getMovieStatistics(): Promise<any> {
    try {
      const total = await this.moviesRepository.count();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const totalViews = await this.moviesRepository
        .createQueryBuilder('movie')
        .select('SUM(movie.views)', 'totalViews')
        .getRawOne();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const avgRating = await this.moviesRepository
        .createQueryBuilder('movie')
        .select('AVG(movie.rating)', 'avgRating')
        .where('movie.rating IS NOT NULL')
        .getRawOne();

      const topGenres = await this.moviesRepository
        .createQueryBuilder('movie')
        .leftJoin('movie.genres', 'genre')
        .select('genre.name', 'genreName')
        .addSelect('COUNT(movie.id)', 'movieCount')
        .groupBy('genre.id')
        .orderBy('movieCount', 'DESC')
        .limit(5)
        .getRawMany();

      return {
        totalMovies: total,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        totalViews: totalViews?.totalViews || 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        averageRating: parseFloat(avgRating?.avgRating || 0).toFixed(2),
        topGenres,
      };

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Error getting statistics: ${error.message}`);
    }
  }

  // Parse sort parameter
  private parseSortParameter(sort: string): [string, 'ASC' | 'DESC'] {
    const validSortFields = [
      'id', 'title', 'original_title', 'release_date', 
      'rating', 'views', 'created_at', 'updated_at', 'duration'
    ];

    if (!sort || !sort.includes(':')) {
      return ['id', 'DESC'];
    }

    const [field, direction] = sort.split(':');
    
    const sortField = validSortFields.includes(field) ? field : 'id';
    const sortDirection = (direction?.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';

    return [sortField, sortDirection];
  }
async findByMovieId(movieId: number): Promise<Review[]> {
  try {
    return await this.reviewsRepository.find({
      where: { movie: { id: movieId } },
      relations: ['user', 'movie'], // Lấy thông tin user và movie
      order: { created_at: 'DESC' }, // Sắp xếp theo thời gian tạo mới nhất
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new BadRequestException(`Error fetching reviews for movie ${movieId}: ${error.message}`);
  }
}

// Thêm vào MoviesService
async getCommentsAndReviewsByMovieId(movieId: number): Promise<any> {
  try {
    // Kiểm tra movie có tồn tại
    const movieExists = await this.moviesRepository.findOne({
      where: { id: movieId },
      select: ['id', 'title']
    });

    if (!movieExists) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    // Lấy reviews với QueryBuilder
    const reviews = await this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.movieId = :movieId', { movieId })
      .orderBy('review.created_at', 'DESC')
      .getMany();

    // ✅ Lấy comments với QueryBuilder
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.movieId = :movieId', { movieId })
      .orderBy('comment.created_at', 'DESC') // Thử created_at trước
      .getMany();

    return {
      movieId,
      movieTitle: movieExists.title,
      reviews,
      comments,
      stats: {
        totalReviews: reviews.length,
        totalComments: comments.length,
        totalFeedback: reviews.length + comments.length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0
      }
    };

  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new BadRequestException(`Error fetching feedback for movie ${movieId}: ${error.message}`);
  }
}

async findMovieByGenreSlug(
  slug: string,
  size?: number
): Promise<Movie[]> {
  return this.moviesRepository.find({
    where: { genres: { slug } },
    relations: ['genres', 'reviews'],
    take: size || undefined,
  });
}
// Lấy 5 phim có views cao nhất
async getTopMovies(): Promise<any> {
  try {
    const movies = await this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .orderBy('movie.views', 'DESC')
      .addOrderBy('movie.rating', 'DESC')
      .take(10) // luôn giới hạn 5 phim
      .getMany();

    return {
      movies,
      total: movies.length,
    };
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new BadRequestException(`Error fetching top movies: ${error.message}`);
  }
}
getCountMovies(): Promise<number> {
  return this.moviesRepository.count();
}
}
