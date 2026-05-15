import { Either, left, right } from 'fp-ts/lib/Either';
import { AnswerRepository } from '../repositories/answer-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface UpdateAnswerUseCaseInput {
  authorId: string;
  answerId: string;
  content: string;
}

export class UpdateAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    answerId,
    authorId,
    content,
  }: UpdateAnswerUseCaseInput): Promise<
    Either<ResourceNotFoundError, undefined>
  > {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer || answer.authorId.toString() !== authorId) {
      return left(new ResourceNotFoundError());
    }
    answer.content = content;
    await this.answerRepository.update(answer);
    return right(undefined);
  }
}
