import { Review } from '../../entity/review.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateReviewDto } from './create_dto';
export declare class ReviewsService {
    private readonly reviewsRepository;
    constructor(reviewsRepository: Repository<Review>);
    findAll(): Promise<Review[]>;
    findById(id: number): Promise<Review | null>;
    delete(id: number): Promise<void>;
    findByIdUserId(userId: number): Promise<Review[]>;
    update(id: number, updateData: Partial<Review>): Promise<Review>;
    updateByIdUser(id: number, userId: number, updateData: Partial<Review>): Promise<Review>;
    create(createReviewDto: CreateReviewDto): Promise<Review>;
    findByMovieId(movieId: number): Promise<Review[]>;
    deleteByUser(reviewId: number, userId: number): Promise<void>;
}
