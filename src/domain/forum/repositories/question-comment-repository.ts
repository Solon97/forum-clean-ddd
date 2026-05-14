import { QuestionComment } from '../entities/comment';

export interface QuestionCommentRepository {
  create(comment: QuestionComment): Promise<void>;
}
