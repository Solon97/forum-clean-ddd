import { Question } from '@/domain/forum/entities/question';
import { QuestionRepository } from '@/domain/forum/repositories/question-repository';

export class InMemoryQuestionRepository implements QuestionRepository {
  private items: Question[] = [];
  async create(question: Question): Promise<void> {
    this.items.push(question);
    return Promise.resolve();
  }
}
