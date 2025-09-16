import { FavoritesService } from './favorites.service';
import { Favorite } from '../../entity/favorite.entity';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    findAll(): Promise<Favorite[]>;
    findByUserId(userId: number): Promise<Favorite[]>;
    getFavoriteMovies(userId: number): Promise<number[]>;
    add(req: any, movieId: number): Promise<Favorite>;
    remove(req: any, movieId: number): Promise<{
        message: string;
    }>;
}
