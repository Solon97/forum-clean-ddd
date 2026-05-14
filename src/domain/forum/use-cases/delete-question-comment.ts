import { QuestionCommentRepository } from '../repositories/question-comment-repository';

interface DeleteQuestionCommentUseCaseInput {
  commentId: string;
  authorId: string;
}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    commentId,
    authorId,
  }: DeleteQuestionCommentUseCaseInput): Promise<void> {
    const comment = await this.questionCommentRepository.findById(commentId);
    if (!comment || comment.authorId.toString() !== authorId) {
      throw new Error('Comment not found');
    }

    await this.questionCommentRepository.delete(comment);
  }
}
