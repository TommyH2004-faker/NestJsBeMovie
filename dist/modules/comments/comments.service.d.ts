import { Comment } from '../../entity/comment.entity';
import { Movie } from '../../entity/movie.entity';
import { User } from '../../entity/User';
import { Repository } from 'typeorm/repository/Repository';
export declare class CommentsService {
    private readonly commentsRepository;
    private readonly usersRepository;
    private readonly moviesRepository;
    constructor(commentsRepository: Repository<Comment>, usersRepository: Repository<User>, moviesRepository: Repository<Movie>);
    findAll(): Promise<Comment[]>;
    findById(id: number): Promise<Comment | null>;
    create(data: {
        content: string;
        userId: number;
        movieId: number;
    }): Promise<Comment>;
    updateByUser(id: number, userId: number, updateData: Partial<Comment>): Promise<Comment>;
    deleteByUser(id: number, userId: number): Promise<void>;
    delete(id: number): Promise<void>;
    update(id: number, data: Partial<Comment>): Promise<Comment>;
}
