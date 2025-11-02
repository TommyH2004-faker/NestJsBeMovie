import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../entity/comment.entity';
import { Movie } from '../../entity/movie.entity';
import { User } from '../../entity/User';
import { Repository } from 'typeorm/repository/Repository';
@Injectable()
export class CommentsService {
     
    constructor(
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['user', 'movie'] // join luôn 2 bảng
    });
  }
    async findById(id: number) {
        return this.commentsRepository.findOneBy({ id });
    }
  //   async create(data: { content: string; userId: number; movieId: number }): Promise<Comment> {
  //   // Kiểm tra userId có tồn tại không
  //   const user = await this.usersRepository.findOne({ where: { id: data.userId } });
  //   if (!user) {
  //     throw new BadRequestException(`User with ID ${data.userId} does not exist.`);
  //   }

  //   // Kiểm tra movieId có tồn tại không
  //   const movie = await this.moviesRepository.findOne({ where: { id: data.movieId } });
  //   if (!movie) {
  //     throw new BadRequestException(`Movie with ID ${data.movieId} does not exist.`);
  //   }

  //   // Tạo mới comment
  //   const comment = this.commentsRepository.create({
  //     content: data.content,
  //     user,
  //     movie,
  //   });

  //   // Lưu comment vào database
  //   return this.commentsRepository.save(comment);
  // }
  // async delete(id: number): Promise<void> {
  //   const comment = await this.commentsRepository.findOneBy({ id });
  //   if (!comment) {
  //     throw new BadRequestException(`Comment with ID ${id} does not exist.`);
  //   }
  //   await this.commentsRepository.remove(comment);
  // }
  //   async update(id: number,movieId:number , userId:number,  data: Partial<Comment>): Promise<Comment> {
  //   const comment = await this.commentsRepository.findOne({
  //     where: { id, movie: { id: movieId }, user: { id: userId } },
  //     relations: ['movie', 'user'],
  //   });

  //   if (!comment) {
  //     throw new BadRequestException(`Comment with ID ${id} does not exist.`);
  //   }

  //   Object.assign(comment, data);
  //   return this.commentsRepository.save(comment);
  // }
    async create(data: { content: string; userId: number; movieId: number }): Promise<Comment> {
    const { content, userId, movieId } = data;

    const comment = this.commentsRepository.create({
      content,
      user: { id: userId },
      movie: { id: movieId },
    });

    return this.commentsRepository.save(comment);
  }

  async updateByUser(
    id: number,
    userId: number,
    updateData: Partial<Comment>,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!comment) {
      throw new BadRequestException(
        `Comment with ID ${id} does not exist or you do not have permission to update it.`,
      );
    }

    Object.assign(comment, updateData);
    return this.commentsRepository.save(comment);
  }

  async deleteByUser(id: number, userId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!comment) {
      throw new BadRequestException(
        'Comment not found or you do not have permission to delete it',
      );
    }

    await this.commentsRepository.remove(comment);
  }
  async delete(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }

  async update(id: number, data: Partial<Comment>): Promise<Comment> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }
    Object.assign(comment, data);
    return this.commentsRepository.save(comment);
  }
}
