import { AnswerCommentRepository } from '../repositories/answer-comment-repository';

interface DeleteAnswerCommentUseCaseInput {
  commentId: string;
  authorId: string;
}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    commentId,
    authorId,
  }: DeleteAnswerCommentUseCaseInput): Promise<void> {
    const comment = await this.answerCommentRepository.findById(commentId);
    if (!comment || comment.authorId.toString() !== authorId) {
      throw new Error('Comment not found');
    }

    await this.answerCommentRepository.delete(comment);
  }
}
