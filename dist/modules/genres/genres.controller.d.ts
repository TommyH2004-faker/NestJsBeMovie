import { GenresService } from './genres.service';
import { Genre } from '../../entity/genre.entity';
import { Movie } from '../../entity/movie.entity';
import { MoviesService } from '../movies/movies.service';
export declare class GenresController {
    private readonly genresService;
    private readonly movieService;
    constructor(genresService: GenresService, movieService: MoviesService);
    findAll(): Promise<Genre[]>;
    createGenre(data: {
        name: string;
        slug: string;
    }): Promise<Genre>;
    deleteGenre(id: number): Promise<void>;
    updateGenre(id: string, updateGenreDto: any): Promise<Genre>;
    findMoviesByGenre(genreId: number, page?: number, size?: number, sort?: string): Promise<{
        movies: Movie[];
        total: number;
    }>;
    getTotalGenres(): Promise<number>;
    get5genreNew(): Promise<Genre[]>;
    getMovieBySlug(slug: string): Promise<Genre[]>;
    getGenreByIdGenre(id: number): Promise<Genre>;
}
