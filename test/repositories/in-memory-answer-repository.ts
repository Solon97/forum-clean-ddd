import { Answer } from '@/domain/forum/entities/answer';
import { AnswerRepository } from '@/domain/forum/repositories/answer-repository';

export class InMemoryAnswerRepository implements AnswerRepository {
  private items: Answer[] = [];

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);
    return Promise.resolve();
  }
}
