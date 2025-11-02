import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Movie } from './movie.entity';
@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { eager: false })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.favorites, { eager: false })
  movie: Movie;
  @CreateDateColumn()
  created_at: Date;
}
