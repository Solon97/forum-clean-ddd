import { Either, left, right } from 'fp-ts/lib/Either';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id/index';
import type { AnswerRepository } from '../repositories/answer-repository';
import { QuestionRepository } from '../repositories/question-repository';
import { NotAllowedError } from '../../../shared/domain/errors/not-allowed';
import { ResourceNotFoundError } from '../../../shared/domain/errors/resource-not-found';

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
