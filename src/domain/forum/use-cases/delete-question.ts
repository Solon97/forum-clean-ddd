import { QuestionRepository } from '../repositories/question-repository';

interface DeleteQuestionUseCaseInput {
  questionId: string;
  authorId?: string;
}

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseInput): Promise<void> {
    const question = await this.questionRepository.findById(questionId);
    if (!question || question.authorId.toString() !== authorId) {
      throw new Error('Question not found');
    }
    await this.questionRepository.delete(question);
  }
}
