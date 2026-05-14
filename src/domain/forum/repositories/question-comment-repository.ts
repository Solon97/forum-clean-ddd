import { QuestionComment } from '../entities/comment';

export interface QuestionCommentRepository {
  create(comment: QuestionComment): Promise<void>;
  findById(id: string): Promise<QuestionComment | null>;
  delete(comment: QuestionComment): Promise<void>;
}
