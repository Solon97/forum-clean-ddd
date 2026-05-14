import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';
import { AnswerComment } from '../entities/comment';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';
import { AnswerRepository } from '../repositories/answer-repository';

export interface CommentOnAnswerUseCaseInput {
  authorId: string;
  answerId: string;
  content: string;
}

export interface CommentOnAnswerUseCaseOutput {
  comment: AnswerComment;
}

export class CommentOnAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerCommentRepository: AnswerCommentRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseInput): Promise<CommentOnAnswerUseCaseOutput> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }
    const comment = new AnswerComment({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentRepository.create(comment);

    return {
      comment,
    };
  }
}
