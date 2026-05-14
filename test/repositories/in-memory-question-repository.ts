import { Question } from '@/domain/forum/entities/question';
import { QuestionRepository } from '@/domain/forum/repositories/question-repository';

export class InMemoryQuestionRepository implements QuestionRepository {
  private items: Question[] = [];
  async create(question: Question): Promise<void> {
    this.items.push(question);
    return Promise.resolve();
  }

  async update(question: Question): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === question.id.value,
    );
    if (index !== -1) {
      this.items[index] = question;
    }
    return Promise.resolve();
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug);
    return Promise.resolve(question || null);
  }

  findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.value === id);
    return Promise.resolve(question || null);
  }

  delete(question: Question): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === question.id.value,
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return Promise.resolve();
  }
}
