import { Question } from '../entities/question';

export interface QuestionRepository {
  create(question: Question): Promise<void>;
}
