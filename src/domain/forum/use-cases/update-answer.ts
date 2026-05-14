import { AnswerRepository } from '../repositories/answer-repository';

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
  }: UpdateAnswerUseCaseInput): Promise<void> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer || answer.authorId.toString() !== authorId) {
      throw new Error('Answer not found');
    }
    answer.content = content;
    await this.answerRepository.update(answer);
  }
}
