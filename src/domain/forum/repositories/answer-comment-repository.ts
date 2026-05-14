import { AnswerComment } from '../entities/comment';

export interface AnswerCommentRepository {
  create(comment: AnswerComment): Promise<void>;
  findById(id: string): Promise<AnswerComment | null>;
  delete(comment: AnswerComment): Promise<void>;
}
