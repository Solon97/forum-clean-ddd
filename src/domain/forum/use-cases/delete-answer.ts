import { AnswerRepository } from '../repositories/answer-repository';

interface DeleteAnswerUseCaseInput {
  answerId: string;
  authorId?: string;
}

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseInput): Promise<void> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer || answer.authorId.toString() !== authorId) {
      throw new Error('Answer not found');
    }
    await this.answerRepository.delete(answer);
  }
}
