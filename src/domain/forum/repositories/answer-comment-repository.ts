import { AnswerComment } from '../entities/comment';

export interface AnswerCommentRepository {
  create(comment: AnswerComment): Promise<void>;
}
