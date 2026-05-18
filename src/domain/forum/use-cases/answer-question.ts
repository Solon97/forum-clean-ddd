import { Answer } from '../entities/answer';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id/index';
import type { AnswerRepository } from '../repositories/answer-repository';
import { AnswerAttachment } from '../entities/answer-attachment';

export interface AnswerQuestionUseCaseInput {
  questionId: string;
  instructorId: string;
  content: string;
  attachmentIds: string[];
}

export interface AnswerQuestionUseCaseOutput {
  answer: Answer;
}

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    questionId,
    instructorId,
    content,
    attachmentIds,
  }: AnswerQuestionUseCaseInput): Promise<AnswerQuestionUseCaseOutput> {
    const answer = new Answer({
      content,
      questionId: new UniqueEntityId(questionId),
      authorId: new UniqueEntityId(instructorId),
    });

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return new AnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityId(attachmentId),
      });
    });

    answer.attachments = answerAttachments;

    await this.answerRepository.create(answer);
    return { answer };
  }
}
