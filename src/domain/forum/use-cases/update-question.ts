import { QuestionRepository } from '../repositories/question-repository';

interface UpdateQuestionUseCaseInput {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
}

export class UpdateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
  }: UpdateQuestionUseCaseInput): Promise<void> {
    const question = await this.questionRepository.findById(questionId);
    if (!question || question.authorId.toString() !== authorId) {
      throw new Error('Question not found');
    }
    question.title = title;
    question.content = content;
    await this.questionRepository.update(question);
  }
}
