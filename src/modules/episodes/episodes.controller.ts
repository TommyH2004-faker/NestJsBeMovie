import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { Episode } from '../../entity/episode.entity';

@Controller('episodes')
export class EpisodesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly episodesService: EpisodesService) {}
  @Get(':movieId')
  findByMovie(@Param('movieId') movieId: number) {
    return this.episodesService.findByMovie(movieId);
  }
  @Post()
  create(@Body() data: Partial<Episode>) {
    return this.episodesService.create(data);
  }
  // Add other methods as needed, such as for updating or deleting episodes
  @Delete(':episode_number/:movieId')
  delete(@Param('episode_number') episode_number: number, @Param('movieId') movieId: number) {
    return this.episodesService.delete(episode_number, movieId);
  }
 @Patch(':episode_number/:movieId')
async update(
  @Param('episode_number') episode_number: number,
  @Param('movieId') movieId: number,
  @Body() data: Partial<Episode>,
) {
  return this.episodesService.update(+episode_number, +movieId, data);
}


}

