import { PaginationParams } from '@/shared/domain/repositories/pagination-params';
import { AnswerComment } from '../entities/comment';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';

interface FetchAnswerCommentsUseCaseInput {
  paginationParams: PaginationParams;
  answerId: string;
}

interface FetchAnswerCommentsUseCaseOutput {
  comments: AnswerComment[];
}

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    paginationParams,
    answerId,
  }: FetchAnswerCommentsUseCaseInput): Promise<FetchAnswerCommentsUseCaseOutput> {
    const comments = await this.answerCommentRepository.findManyByAnswerId(
      paginationParams,
      answerId,
    );

    return {
      comments,
    };
  }
}
