import { Episode } from '../../entity/episode.entity';
import { Repository } from 'typeorm/repository/Repository';
export declare class EpisodesService {
    private readonly episodeRepository;
    constructor(episodeRepository: Repository<Episode>);
    findByMovie(movieId: number): Promise<Episode[]>;
    create(data: Partial<Episode>): Promise<Episode>;
    delete(episode_number: number, movieId: number): Promise<import("typeorm").DeleteResult>;
    update(episode_number: number, movieId: number, data: Partial<Episode>): Promise<Episode | null>;
}
