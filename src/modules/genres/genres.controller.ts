import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Genre } from '../../entity/genre.entity';
import { Movie } from '../../entity/movie.entity';
import { MoviesService } from '../movies/movies.service';

@Controller('genres')
export class GenresController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly genresService: GenresService, private readonly movieService: MoviesService) {}

  @Get()
  findAll() {
    return this.genresService.findAll();
  }
  @Post()
  async createGenre(@Body() data: { name: string; slug: string }): Promise<Genre> {
    if (!data.name || !data.slug) {
      throw new BadRequestException('Name and slug are required.');
    }
    return this.genresService.create(data);
  }
  @Delete(':id')
  async deleteGenre(@Param('id') id: number): Promise<void> {
    return this.genresService.deleteGenre(id);
  }


@Patch(':id')
async updateGenre(
  @Param('id') id: string,
  @Body() updateGenreDto: any, // tạm any để debug
): Promise<Genre> {
  console.log('Body received in Controller:', updateGenreDto);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return this.genresService.update(+id, updateGenreDto);
}

@Get(':id/movies')
async findMoviesByGenre(
  @Param('id') genreId: number,
  @Query('page') page: number = 1,
  @Query('size') size: number = 10,
  @Query('sort') sort: string = 'title',
): Promise<{ movies: Movie[]; total: number }> {
  return this.genresService.findMoviesByGenre(genreId, page, size, sort);
}
@Get('total')
 getTotalGenres(): Promise<number> {
   
  return this.genresService.getTotalGenres();
}
@Get('popular')
async get5genreNew(): Promise<Genre[]> {
  return this.genresService.get5genreNew();
}

@Get('slug/:slug')
async getMovieBySlug(@Param('slug') slug: string) {
  const movie = await this.genresService.findMovieByGenreSlug(slug);
  
  if (!movie) {
    throw new NotFoundException(`Movie with slug "${slug}" not found`);
  }
  
  return movie;
}
@Get(':id')
getGenreByIdGenre(@Param('id') id: number) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return this.genresService.getGenreById(id);
}
}
