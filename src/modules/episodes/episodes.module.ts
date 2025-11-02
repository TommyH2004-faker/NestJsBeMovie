import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Episode } from '../../entity/episode.entity';

@Module({
  controllers: [EpisodesController],
  providers: [EpisodesService],
  exports: [EpisodesService],
  imports: [TypeOrmModule.forFeature([Episode])],
})
export class EpisodesModule {}
