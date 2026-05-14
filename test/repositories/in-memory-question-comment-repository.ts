import { QuestionComment } from '@/domain/forum/entities/comment';
import { QuestionCommentRepository } from '@/domain/forum/repositories/question-comment-repository';

export class InMemoryQuestionCommentRepository implements QuestionCommentRepository {
  private items: QuestionComment[] = [];

  create(comment: QuestionComment): Promise<void> {
    this.items.push(comment);
    return Promise.resolve();
  }

  update(question: QuestionComment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === question.id.value,
    );
    if (index !== -1) {
      this.items[index] = question;
    }
    return Promise.resolve();
  }

  findById(id: string): Promise<QuestionComment | null> {
    const comment = this.items.find((item) => item.id.value === id);
    return Promise.resolve(comment || null);
  }

  delete(comment: QuestionComment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === comment.id.value,
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return Promise.resolve();
  }
}
