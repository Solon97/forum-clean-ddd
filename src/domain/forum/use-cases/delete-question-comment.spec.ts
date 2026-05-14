import { Mock } from 'vitest';
import {
  assertRepositorySpyCalled,
  assertRepositorySpyNotCalled,
} from '@test/helpers/spy-helpers';
import { InMemoryQuestionCommentRepository } from '@test/repositories/in-memory-question-comment-repository';
import { QuestionComment } from '../entities/comment';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';

let inMemoryQuestionCommentRepository: QuestionCommentRepository;
let sut: DeleteQuestionCommentUseCase;
let sutRepositorySpy: Mock<typeof inMemoryQuestionCommentRepository.delete>;

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository);
    sutRepositorySpy = vi.spyOn(inMemoryQuestionCommentRepository, 'delete');
  });

  it('should be able to delete a question comment', async () => {
    const exampleComment = new QuestionComment({
      content: 'This is a question comment',
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
    });

    await inMemoryQuestionCommentRepository.create(exampleComment);

    await sut.execute({
      commentId: exampleComment.id.toString(),
      authorId: exampleComment.authorId.toString(),
    });

    assertRepositorySpyCalled(sutRepositorySpy, exampleComment);

    const deletedComment = await inMemoryQuestionCommentRepository.findById(
      exampleComment.id.toString(),
    );

    expect(deletedComment).toBeNull();
  });

  it('should not be able to delete a non existing question comment', async () => {
    await expect(() =>
      sut.execute({
        commentId: 'non-existing-comment-id',
        authorId: 'any-author-id',
      }),
    ).rejects.toThrow('Comment not found');

    assertRepositorySpyNotCalled(sutRepositorySpy);
  });

  it('should not be able to delete a question comment from another author', async () => {
    const exampleComment = new QuestionComment({
      content: 'This is a question comment',
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
    });

    await inMemoryQuestionCommentRepository.create(exampleComment);

    await expect(() =>
      sut.execute({
        commentId: exampleComment.id.toString(),
        authorId: 'other-author-id',
      }),
    ).rejects.toThrow('Comment not found');

    assertRepositorySpyNotCalled(sutRepositorySpy);
  });
});
