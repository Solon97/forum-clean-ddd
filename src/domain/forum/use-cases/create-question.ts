import { Question } from '../entities/question';
import { UniqueEntityId } from '../entities/value-objects/unique-entity-id';
import { QuestionRepository } from '../repositories/question-repository';

interface CreateQuestionUseCaseInput {
  authorId: string;
  title: string;
  content: string;
}

interface CreateQuestionUseCaseOutput {
  question: Question;
}

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseInput): Promise<CreateQuestionUseCaseOutput> {
    const question = new Question({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    });

    await this.questionRepository.create(question);

    return {
      question,
    };
  }
}
