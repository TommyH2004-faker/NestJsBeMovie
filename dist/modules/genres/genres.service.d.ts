import { Genre } from '../../entity/genre.entity';
import { Repository } from 'typeorm/repository/Repository';
import { UpdateGenreDto } from './dto/update-genre';
import { Movie } from '../../entity/movie.entity';
export declare class GenresService {
    private readonly genresRepository;
    private readonly moviesRepository;
    constructor(genresRepository: Repository<Genre>, moviesRepository: Repository<Movie>);
    findAll(): Promise<Genre[]>;
    create(data: {
        name: string;
        slug: string;
    }): Promise<Genre>;
    deleteGenre(id: number): Promise<void>;
    update(id: number, updateDto: UpdateGenreDto): Promise<Genre>;
    findMoviesByGenre(genreId: number, page: number, size: number, sort: string): Promise<{
        movies: Movie[];
        total: number;
    }>;
    getTotalGenres(): Promise<number>;
    get5genreNew(): Promise<Genre[]>;
    findMovieByGenreSlug(slug: string, size?: number): Promise<Genre[]>;
    getGenreById(id: number): Promise<Genre>;
}
