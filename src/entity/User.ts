import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { Favorite } from './favorite.entity';
import { Comment } from './comment.entity';
import { Role } from './role.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  refreshToken: string;
  @Column({ nullable: true })
  createdAt: Date;
  @Column({ nullable: true })
  enabled: boolean;
  @Column({ nullable: true })
  updatedAt: Date;
  @Column({ nullable: true })
  gender: string;
  @Column({ type: 'text', nullable: true })
  avatar: string;
  @Column({ nullable: true })
  activationCode: string;
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  // @ManyToMany(() => Role, (role) => role.users, { eager: true })
  // @JoinTable({
  //   name: 'user_roles',
  //   joinColumn: {
  //     name: 'user_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'role_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // roles: Role[];
  @ManyToMany(() => Role, (role) => role.users, { eager: true, cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
