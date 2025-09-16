import { MoviesService } from './movies.service';
import { Movie } from '../../entity/movie.entity';
import { Review } from '../../entity/review.entity';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    getAllMovies(page?: number, size?: number, sort?: string): Promise<any>;
    getCountMovies(): Promise<number>;
    findByMovieId(movieId: number): Promise<Review[]>;
    getAllMoviesWithoutPagination(sort?: string): Promise<{
        movies: Movie[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
    getAllMoviesWithLimit(limit?: number, sort?: string): Promise<{
        movies: Movie[];
        total: number;
        limit: number | undefined;
        sort: string;
    }>;
    searchMovies(title?: string, genreId?: number, page?: number, size?: number, sort?: string): Promise<any>;
    getNewMovies(page?: number, size?: number, sort?: string): Promise<any>;
    getTopMovies(): Promise<any>;
    getMoviesByGenre(genreId: number, page?: number, size?: number, sort?: string): Promise<any>;
    getMoviesByGenreAlias(genreId: number, page?: number, size?: number, sort?: string): Promise<any>;
    getMoviesByCountry(country: string, page?: number, size?: number, sort?: string): Promise<any>;
    getRelatedMovies(movieId: number, limit?: number): Promise<any>;
    getPopularMovies(page?: number, size?: number): Promise<any>;
    getMovie(id: number): Promise<Movie>;
    createMovie(movieData: Partial<Movie>): Promise<Movie>;
    updateMovie(id: number, updateData: Partial<Movie>): Promise<Movie>;
    deleteMovie(id: number): Promise<{
        message: string;
    }>;
    incrementViews(id: number): Promise<Movie>;
    getMovieStats(): Promise<any>;
    getMovieFeedback(movieId: number): Promise<any>;
    getMovieBySlug(slug: string): Promise<Movie[]>;
    uploadImages(files: {
        poster?: Express.Multer.File[];
        banner?: Express.Multer.File[];
    }): {
        poster_url: string | null;
        banner_url: string | null;
    };
}
