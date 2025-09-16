import { ReviewsService } from './reviews.service';
import { Review } from '../../entity/review.entity';
import { CreateReviewDto } from './create_dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findAll(): Promise<Review[]>;
    findById(id: number): Promise<Review | null>;
    findMyReviews(req: any): Promise<Review[]>;
    deleteReview(id: number, req: any): Promise<void>;
    createReview(createReviewDto: CreateReviewDto, req: any): Promise<Review>;
    updateReviewByUser(id: number, updateData: Partial<Review>, req: any): Promise<Review>;
    findByMovieId(movieId: number): Promise<Review[]>;
}
