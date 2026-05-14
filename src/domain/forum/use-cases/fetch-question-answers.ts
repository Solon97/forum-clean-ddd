import { PaginationParams } from '@/shared/domain/repositories/pagination-params';
import { Answer } from '../entities/answer';
import { AnswerRepository } from '../repositories/answer-repository';

interface FetchQuestionAnswersUseCaseInput {
  paginationParams: PaginationParams;
  questionId: string;
}

interface FetchQuestionAnswersUseCaseOutput {
  answers: Answer[];
}

export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    paginationParams,
    questionId,
  }: FetchQuestionAnswersUseCaseInput): Promise<FetchQuestionAnswersUseCaseOutput> {
    const answers = await this.answerRepository.findManyByQuestionId(
      paginationParams,
      questionId,
    );
    return {
      answers,
    };
  }
}
