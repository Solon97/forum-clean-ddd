import { AnswerComment } from '@/domain/forum/entities/comment';
import { AnswerCommentRepository } from '@/domain/forum/repositories/answer-comment-repository';

export class InMemoryAnswerCommentRepository implements AnswerCommentRepository {
  private items: AnswerComment[] = [];

  create(comment: AnswerComment): Promise<void> {
    this.items.push(comment);
    return Promise.resolve();
  }

  update(answer: AnswerComment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === answer.id.value,
    );
    if (index !== -1) {
      this.items[index] = answer;
    }
    return Promise.resolve();
  }

  findById(id: string): Promise<AnswerComment | null> {
    const comment = this.items.find((item) => item.id.value === id);
    return Promise.resolve(comment || null);
  }

  delete(comment: AnswerComment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === comment.id.value,
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return Promise.resolve();
  }
}
