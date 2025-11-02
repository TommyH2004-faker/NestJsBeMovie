import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../../entity/review.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateReviewDto } from './create_dto';

@Injectable()
export class ReviewsService {
    // eslint-disable-next-line prettier/prettier
    constructor(@InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>) {}
    async findAll(): Promise<Review[]> {
  return this.reviewsRepository.find({
    relations: ['user', 'movie'] // join luôn 2 bảng
  });
}

    async findById(id: number): Promise<Review | null> {
        return this.reviewsRepository.findOneBy({ id });
    }
    async delete(id: number): Promise<void> {
        const review = await this.reviewsRepository.findOneBy({ id });
        if (!review) {
            throw new Error(`Review with ID ${id} does not exist.`);
        }
        await this.reviewsRepository.remove(review);
    }

   async findByIdUserId(userId: number): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { user: { id: userId } },
      relations: ['movie'], // Lấy thông tin phim liên quan
    });
  }

  async update (id: number, updateData: Partial<Review>): Promise<Review> {
    const review = await this.reviewsRepository.findOneBy({ id });
    if (!review) {
      throw new Error(`Review with ID ${id} does not exist.`);
    }
    Object.assign(review, updateData);
    return this.reviewsRepository.save(review);
  }
 async updateByIdUser(
  id: number,
  userId: number,
  updateData: Partial<Review>,
): Promise<Review> {
  // Tìm review dựa trên ID và userId
  const review = await this.reviewsRepository.findOne({
    where: { id, user: { id: userId } },
    relations: ['user'], // Đảm bảo quan hệ với user được load
  });

  // Nếu không tìm thấy review hoặc user không có quyền
  if (!review) {
    throw new BadRequestException(
      `Review with ID ${id} does not exist or you do not have permission to update it.`,
    );
  }

  // Cập nhật dữ liệu
  Object.assign(review, updateData);

  // Lưu lại review đã cập nhật
  return this.reviewsRepository.save(review);
}

// async create(createReviewDto: CreateReviewDto): Promise<Review> {
//     const { userId, movieId } = createReviewDto;

//     // Kiểm tra xem userId đã đánh giá movieId hay chưa
//     const existingReview = await this.reviewsRepository.findOne({
//       where: { user: { id: userId }, movie: { id: movieId } },
//     });

//     if (existingReview) {
//       throw new BadRequestException(
//         `User with ID ${userId} has already reviewed the movie with ID ${movieId}.`,
//       );
//     }

//     // Tạo mới review
//     const review = this.reviewsRepository.create({
//       ...createReviewDto,
//       user: { id: userId }, // Gắn userId vào review
//       movie: { id: movieId }, // Gắn movieId vào review
//     });

//     // Lưu review vào database
//     return this.reviewsRepository.save(review);
//   }
async create(createReviewDto: CreateReviewDto): Promise<Review> {
  const { userId, movieId } = createReviewDto;

  // Tạo mới review (không check trùng nữa)
  const review = this.reviewsRepository.create({
    ...createReviewDto,
    user: { id: userId },
    movie: { id: movieId },
  });

  return this.reviewsRepository.save(review);
}

  async findByMovieId(movieId: number): Promise<Review[]> {
  return this.reviewsRepository.find({
    where: { movie: { id: movieId } },
    relations: ['user', 'movie'], // để trả luôn thông tin user & movie
    order: { created_at: 'DESC' }
  });
}

async deleteByUser(reviewId: number, userId: number): Promise<void> {
  const review = await this.reviewsRepository.findOne({
    where: { id: reviewId, user: { id: userId } }
  });
  if (!review) {
    throw new BadRequestException('Review not found or you do not have permission to delete it');
  }
  await this.reviewsRepository.remove(review);
}







}
