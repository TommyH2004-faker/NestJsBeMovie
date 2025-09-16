import { CommentsService } from './comments.service';
import { Comment } from '../../entity/comment.entity';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findAll(): Promise<Comment[]>;
    findById(id: number): Promise<Comment | null>;
    createComment(data: {
        content: string;
        movieId: number;
    }, req: any): Promise<Comment>;
    updateComment(id: number, updateData: Partial<Comment>, req: any): Promise<Comment>;
    deleteComment(id: number, req: any): Promise<void>;
    deleteComment2(id: number): Promise<void>;
    update(id: number, data: Partial<Comment>): Promise<Comment>;
}
