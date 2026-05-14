import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';
import { QuestionComment } from '../entities/comment';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { QuestionRepository } from '../repositories/question-repository';

export interface CommentOnQuestionUseCaseInput {
  authorId: string;
  questionId: string;
  content: string;
}

export interface CommentOnQuestionUseCaseOutput {
  comment: QuestionComment;
}

export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseInput): Promise<CommentOnQuestionUseCaseOutput> {
    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }
    const comment = new QuestionComment({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    });

    await this.questionCommentRepository.create(comment);

    return {
      comment,
    };
  }
}
