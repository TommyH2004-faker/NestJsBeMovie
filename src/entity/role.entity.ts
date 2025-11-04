import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
  // Many-to-Many relationship với User
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
