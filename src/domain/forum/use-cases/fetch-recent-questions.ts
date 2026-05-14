import { Question } from '../entities/question';
import { QuestionRepository } from '../repositories/question-repository';

interface FetchRecentQuestionsUseCaseInput {
  page: number;
}

interface FetchRecentQuestionsUseCaseOutput {
  questions: Question[];
}

export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseInput): Promise<FetchRecentQuestionsUseCaseOutput> {
    const questions = await this.questionRepository.findManyRecent({ page });
    return {
      questions,
    };
  }
}
