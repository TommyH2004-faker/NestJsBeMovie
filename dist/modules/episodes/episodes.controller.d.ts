import { EpisodesService } from './episodes.service';
import { Episode } from '../../entity/episode.entity';
export declare class EpisodesController {
    private readonly episodesService;
    constructor(episodesService: EpisodesService);
    findByMovie(movieId: number): Promise<Episode[]>;
    create(data: Partial<Episode>): Promise<Episode>;
    delete(episode_number: number, movieId: number): Promise<import("typeorm").DeleteResult>;
    update(episode_number: number, movieId: number, data: Partial<Episode>): Promise<Episode | null>;
}
