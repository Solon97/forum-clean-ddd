import { Either, left, right } from 'fp-ts/lib/Either';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id/index.js';
import type { AnswerRepository } from '../repositories/answer-repository.js';
import { QuestionRepository } from '../repositories/question-repository.js';
import { NotAllowedError } from './errors/not-allowed.js';
import { ResourceNotFoundError } from './errors/resource-not-found.js';

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
  }: SetBestAnswerUseCaseInput): Promise<
    Either<ResourceNotFoundError | NotAllowedError, undefined>
  > {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );
    if (!question) {
      return left(new ResourceNotFoundError());
    }
    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }
    question.bestAnswerId = new UniqueEntityId(answerId);
    await this.questionRepository.update(question);
    return right(undefined);
  }
}
