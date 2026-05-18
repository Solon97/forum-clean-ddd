import { Question } from '../entities/question';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';
import { QuestionRepository } from '../repositories/question-repository';
import { QuestionAttachment } from '../entities/question-attachment';
import { QuestionAttachmentList } from '../entities/question-attachment-list';

export interface CreateQuestionUseCaseInput {
  authorId: string;
  title: string;
  content: string;
  attachmentIds: string[];
}

export interface CreateQuestionUseCaseOutput {
  question: Question;
}

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentIds,
  }: CreateQuestionUseCaseInput): Promise<CreateQuestionUseCaseOutput> {
    const question = new Question({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    });

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return new QuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId(attachmentId),
      });
    });

    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.questionRepository.create(question);

    return {
      question,
    };
  }
}
