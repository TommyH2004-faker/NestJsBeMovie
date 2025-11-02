import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];
  @CreateDateColumn() // Thêm decorator này
  created_at: Date;

  @UpdateDateColumn() // Thêm decorator này (tùy chọn)
  updated_at: Date;
}
