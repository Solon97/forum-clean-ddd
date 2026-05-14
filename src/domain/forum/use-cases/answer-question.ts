import { Answer } from '../entities/answer.js';
import { UniqueEntityId } from '../entities/value-objects/unique-entity-id/index.js';
import type { AnswerRepository } from '../repositories/answer-repository.js';

export interface AnswerQuestionUseCaseInput {
  questionId: string;
  instructorId: string;
  content: string;
}

export interface AnswerQuestionUseCaseOutput {
  answer: Answer;
}

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    questionId,
    instructorId,
    content,
  }: AnswerQuestionUseCaseInput): Promise<AnswerQuestionUseCaseOutput> {
    const answer = new Answer({
      content,
      questionId: new UniqueEntityId(questionId),
      authorId: new UniqueEntityId(instructorId),
    });
    await this.answerRepository.create(answer);
    return { answer };
  }
}
