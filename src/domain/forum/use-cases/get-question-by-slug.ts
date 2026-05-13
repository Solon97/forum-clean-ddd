import { Question } from '../entities/question';
import { QuestionRepository } from '../repositories/question-repository';

interface GetQuestionBySlugUseCaseInput {
  slug: string;
}

interface GetQuestionBySlugUseCaseOutput {
  question: Question;
}

export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseInput): Promise<GetQuestionBySlugUseCaseOutput> {
    const question = await this.questionRepository.findBySlug(slug);
    if (!question) {
      throw new Error('Question not found');
    }
    return {
      question,
    };
  }
}
