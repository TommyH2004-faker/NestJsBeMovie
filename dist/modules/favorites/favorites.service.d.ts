import { Favorite } from '../../entity/favorite.entity';
import { Movie } from '../../entity/movie.entity';
import { User } from '../../entity/User';
import { Repository } from 'typeorm';
export declare class FavoritesService {
    private favoritesRepository;
    private readonly userRepository;
    private readonly movieRepository;
    constructor(favoritesRepository: Repository<Favorite>, userRepository: Repository<User>, movieRepository: Repository<Movie>);
    findAll(): Promise<Favorite[]>;
    deleteFavorite(id: number): Promise<void>;
    findByUserId(userId: number): Promise<Favorite[]>;
    add(userId: number, movieId: number): Promise<Favorite>;
    getFavoriteMovieIds(userId: number): Promise<number[]>;
    remove(userId: number, movieId: number): Promise<{
        message: string;
    }>;
}
