import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from '../../entity/genre.entity';
import { Repository } from 'typeorm/repository/Repository';
import { UpdateGenreDto } from './dto/update-genre';
import { Movie } from '../../entity/movie.entity';

@Injectable()
export class GenresService {

    // eslint-disable-next-line prettier/prettier
    constructor( @InjectRepository(Genre)
        private readonly genresRepository: Repository<Genre>,
       @InjectRepository(Movie)
       private readonly moviesRepository: Repository<Movie>
    ) {}
  findAll() {
    return this.genresRepository.find();
  }

   async create(data: { name: string; slug: string }): Promise<Genre> {
    // Kiểm tra xem genre đã tồn tại chưa
    const existingGenre = await this.genresRepository.findOne({
      where: [{ name: data.name }, { slug: data.slug }],
    });
    if (existingGenre) {
      throw new BadRequestException(
        `Genre with name "${data.name}" or slug "${data.slug}" already exists.`,
      );
    }

    // Tạo mới genre
    const genre = this.genresRepository.create(data);
    // Lưu genre vào database
    return this.genresRepository.save(genre);
  }
  async deleteGenre(id: number): Promise<void> {
    // Xóa genre theo ID
    const genre = await this.genresRepository.findOneBy({ id });
    if (!genre) {
      throw new BadRequestException(`Genre with ID ${id} does not exist.`);
    }
    await this.genresRepository.remove(genre);
  }


 async update(id: number, updateDto: UpdateGenreDto): Promise<Genre> {
  const genre = await this.genresRepository.findOne({ where: { id } });
  if (!genre) {
    throw new NotFoundException(`Genre with ID ${id} not found`);
  }

  if (updateDto.name) genre.name = updateDto.name;
  if (updateDto.slug) genre.slug = updateDto.slug;

  const saved = await this.genresRepository.save(genre);

  return saved;
}

async findMoviesByGenre(
  genreId: number,
  page: number,
  size: number,
  sort: string,
): Promise<{ movies: Movie[]; total: number }> {
   
  const [movies, total] = await this.moviesRepository.findAndCount({
    where: { genres: { id: genreId } },
    relations: ['genres'], // Lấy thông tin thể loại liên quan
    order: { [sort]: 'ASC' }, // Sắp xếp theo trường được chỉ định
    skip: (page - 1) * size,
    take: size,
  });

  return { movies, total };
}
async getTotalGenres(): Promise<number> {
  return this.genresRepository.count();
}
async get5genreNew(): Promise<Genre[]> {
  return this.genresRepository.find({
    order: { created_at: 'DESC' },
    take: 5,
  });
}

async findMovieByGenreSlug(
  slug: string,
  size?: number
): Promise<Genre[]> {
  return this.genresRepository.find({
    where: { slug },
    relations: ['movies'],
    take: size || undefined,
  });
}
 async getGenreById(id: number): Promise<Genre> {
  const genre = await this.genresRepository.findOneBy({ id });
  if (!genre) {
    throw new NotFoundException(`Genre with ID ${id} not found`);
  }
  return genre;
}
}