import { Either, left, right } from 'fp-ts/lib/Either';
import { QuestionRepository } from '../repositories/question-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

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
  }: UpdateQuestionUseCaseInput): Promise<
    Either<ResourceNotFoundError, undefined>
  > {
    const question = await this.questionRepository.findById(questionId);
    if (!question || question.authorId.toString() !== authorId) {
      return left(new ResourceNotFoundError());
    }
    question.title = title;
    question.content = content;
    await this.questionRepository.update(question);
    return right(undefined);
  }
}
