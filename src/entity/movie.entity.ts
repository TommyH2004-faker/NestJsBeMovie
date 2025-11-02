import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Genre } from './genre.entity';
import { Episode } from './episode.entity';
import { Favorite } from './favorite.entity';
import { Review } from './review.entity';
import { Comment } from './comment.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // Tên phim hiển thị

  @Column({ nullable: true })
  original_title: string; // Tên gốc (nếu có)

  @Column({ unique: true })
  slug: string; // Dùng cho SEO

  @Column('text')
  description: string; // Nội dung tóm tắt

  @Column({ type: 'year', nullable: true })
  release_date: string; // Chỉ lưu năm, ví dụ: 2020

  @Column({ nullable: true })
  duration: number; // Thời lượng (phút)

  @Column()
  poster_url: string; // Ảnh poster

  @Column({ nullable: true })
  banner_url: string; // Ảnh banner (background)

  @Column({ nullable: true })
  trailer_url: string; // Trailer (YouTube / MP4)

  @Column({ default: 'ongoing' })
  status: string; // ongoing, completed

  @Column({ nullable: true })
  type: string; // movie, series, tvshow...

  @Column({ nullable: true })
  country: string; // Quốc gia sản xuất

  @Column({ nullable: true })
  director: string; // Đạo diễn

  @Column('text', { nullable: true })
  cast: string; // Danh sách diễn viên

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true }) // Đổi precision thành 3 để support 10.0
  rating: number; // Điểm đánh giá (IMDb...)

  @Column({ default: 0 })
  views: number; // Lượt xem

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // ===== RELATIONS =====
  @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: true })
  @JoinTable({
    name: 'movie_genres', // Tên bảng trung gian rõ ràng
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  genres: Genre[];

  @OneToMany(() => Episode, (episode) => episode.movie)
  episodes: Episode[];

  @OneToMany(() => Comment, (comment) => comment.movie)
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.movie)
  favorites: Favorite[];
}
