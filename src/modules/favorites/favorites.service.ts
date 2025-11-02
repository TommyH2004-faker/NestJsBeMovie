 
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from '../../entity/favorite.entity';
import { Movie } from '../../entity/movie.entity';
import { User } from '../../entity/User';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
    constructor(
        // eslint-disable-next-line prettier/prettier
        @InjectRepository(Favorite)
        private favoritesRepository: Repository<Favorite>,
          @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    ) {}

    async findAll(): Promise<Favorite[]> {
        // Trả về tất cả các mục yêu thích
        return this.favoritesRepository.find({
            relations: ['user', 'movie'], // Giả sử bạn muốn lấy thông tin người dùng và phim liên quan
        });
    }
    async deleteFavorite(id: number): Promise<void> {
        // Xóa mục yêu thích theo ID
        const favorite = await this.favoritesRepository.findOneBy({ id });
        if (!favorite) {
            throw new Error(`Favorite with ID ${id} does not exist.`);
        }
        await this.favoritesRepository.remove(favorite);
    }
    async findByUserId(userId: number): Promise<Favorite[]> {
        // Tìm tất cả mục yêu thích của người dùng theo ID
        return this.favoritesRepository.find({
            where: { user: { id: userId } },
            relations: ['movie'], // Giả sử bạn muốn lấy thông tin phim liên quan
        });
    }
  async add(userId: number, movieId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });

    if (!user || !movie) {
      throw new BadRequestException('User and movie are required to create a favorite.');
    }

    // Check đã tồn tại chưa

    const existing = await this.favoritesRepository
      .createQueryBuilder('fav')
      .where('fav.userId = :userId', { userId })
      .andWhere('fav.movieId = :movieId', { movieId })
      .getOne();

    // const existing = await this.favoritesRepository.findOne({
    //   where: {
    //     user: { id: userId },
    //     movie: { id: movieId },
    //   },
    // });



    if (existing) {
      throw new BadRequestException('This movie is already in your favorites.');
    }

    const fav = this.favoritesRepository.create({ user, movie });
    return this.favoritesRepository.save(fav);
  }

 async getFavoriteMovieIds(userId: number): Promise<number[]> {
     
    const favorites = await this.favoritesRepository.find({
      where: { user: { id: userId } },
      relations: ['movie'],
    });
    return favorites.map(fav => fav.movie.id);
  }

 async remove(userId: number, movieId: number): Promise<{ message: string }> {
    const fav = await this.favoritesRepository.findOne({
      where: { user: { id: userId }, movie: { id: movieId } },
    });

    if (!fav) throw new NotFoundException('Favorite không tồn tại.');

    await this.favoritesRepository.remove(fav);
    return { message: 'Xóa favorite thành công' };
  }
}
