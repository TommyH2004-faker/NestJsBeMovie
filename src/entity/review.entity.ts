import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Movie } from './movie.entity';
@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column('text', { nullable: true })
  comment: string;

  // @ManyToOne(() => User, (user) => user.reviews)
  // user: User;
  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'SET NULL',
  })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.reviews)
  movie: Movie;

  @CreateDateColumn()
  created_at: Date;
}
