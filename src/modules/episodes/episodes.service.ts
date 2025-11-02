import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from '../../entity/episode.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class EpisodesService {
    // eslint-disable-next-line prettier/prettier
    constructor(@InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>) {}
 findByMovie(movieId: number) {
    return this.episodeRepository.find({
      where: { movie: { id: movieId } },
      order: { episode_number: 'ASC' },
    });
  }

  create(data: Partial<Episode>) {
    const ep = this.episodeRepository.create(data);
    return this.episodeRepository.save(ep);
  }
  delete( episode_number: number, movieId: number ) {
    return this.episodeRepository.delete({ episode_number, movie: { id: movieId } });
  }
 async update(episode_number: number, movieId: number, data: Partial<Episode>) {
  const episode = await this.episodeRepository.findOne({
    where: { episode_number, movie: { id: movieId } },
    relations: ['movie'],
  });

  if (!episode) return null;

  Object.assign(episode, data);
  return this.episodeRepository.save(episode);
}


}
