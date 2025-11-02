import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  price: number;

  @Column({ type: 'text' })
  @IsNotEmpty()
  description: string;

  @Column()
  @IsNotEmpty()
  createdAt: Date;

  @Column()
  @IsNotEmpty()
  updatedAt: Date;
}
