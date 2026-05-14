import { UniqueEntityId } from '../entities/value-objects/unique-entity-id/index.js';
import type { AnswerRepository } from '../repositories/answer-repository.js';
import { QuestionRepository } from '../repositories/question-repository.js';

export interface SetBestAnswerUseCaseInput {
  answerId: string;
  authorId: string;
}

export class SetBestAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: SetBestAnswerUseCaseInput): Promise<void> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );
    if (!question) {
      throw new Error('Question not found');
    }
    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed');
    }
    question.bestAnswerId = new UniqueEntityId(answerId);
    await this.questionRepository.update(question);
  }
}
