import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  episode_number: number;

  @Column()
  title: string;

  @Column()
  video_url: string;

  @Column({ nullable: true })
  subtitle_url: string;

  @ManyToOne(() => Movie, (movie) => movie.episodes)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @CreateDateColumn()
  created_at: Date;
}
