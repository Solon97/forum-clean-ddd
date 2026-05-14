import { PaginationParams } from '@/shared/domain/repositories/pagination-params';
import { QuestionComment } from '../entities/comment';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';

interface FetchQuestionCommentsUseCaseInput {
  paginationParams: PaginationParams;
  questionId: string;
}

interface FetchQuestionCommentsUseCaseOutput {
  comments: QuestionComment[];
}

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    paginationParams,
    questionId,
  }: FetchQuestionCommentsUseCaseInput): Promise<FetchQuestionCommentsUseCaseOutput> {
    const comments = await this.questionCommentRepository.findManyByQuestionId(
      paginationParams,
      questionId,
    );

    return {
      comments,
    };
  }
}
