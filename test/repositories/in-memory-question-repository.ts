import { Question } from '@/domain/forum/entities/question';
import { QuestionRepository } from '@/domain/forum/repositories/question-repository';

export class InMemoryQuestionRepository implements QuestionRepository {
  private items: Question[] = [];
  async create(question: Question): Promise<void> {
    this.items.push(question);
    return Promise.resolve();
  }
  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug);
    return Promise.resolve(question || null);
  }
}
