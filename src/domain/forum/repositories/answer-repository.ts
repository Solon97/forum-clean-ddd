import type { Answer } from '../entities/answer.js';

export interface AnswerRepository {
  create(answer: Answer): Promise<void>;
  update(answer: Answer): Promise<void>;
  findById(id: string): Promise<Answer | null>;
  delete(answer: Answer): Promise<void>;
}
