import { Mock } from 'vitest';
import {
  assertRepositorySpyCalled,
  assertRepositorySpyNotCalled,
} from '@test/helpers/spy-helpers';
import { InMemoryAnswerCommentRepository } from '@test/repositories/in-memory-answer-comment-repository';
import { AnswerComment } from '../entities/comment';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';

let inMemoryAnswerCommentRepository: AnswerCommentRepository;
let sut: DeleteAnswerCommentUseCase;
let sutRepositorySpy: Mock<typeof inMemoryAnswerCommentRepository.delete>;

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository);
    sutRepositorySpy = vi.spyOn(inMemoryAnswerCommentRepository, 'delete');
  });

  it('should be able to delete a answer comment', async () => {
    const exampleComment = new AnswerComment({
      content: 'This is an answer comment',
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
    });

    await inMemoryAnswerCommentRepository.create(exampleComment);

    await sut.execute({
      commentId: exampleComment.id.toString(),
      authorId: exampleComment.authorId.toString(),
    });

    assertRepositorySpyCalled(sutRepositorySpy, exampleComment);

    const deletedComment = await inMemoryAnswerCommentRepository.findById(
      exampleComment.id.toString(),
    );

    expect(deletedComment).toBeNull();
  });

  it('should not be able to delete a non existing answer comment', async () => {
    await expect(() =>
      sut.execute({
        commentId: 'non-existing-comment-id',
        authorId: 'any-author-id',
      }),
    ).rejects.toThrow('Comment not found');

    assertRepositorySpyNotCalled(sutRepositorySpy);
  });

  it('should not be able to delete a answer comment from another author', async () => {
    const exampleComment = new AnswerComment({
      content: 'This is an answer comment',
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
    });

    await inMemoryAnswerCommentRepository.create(exampleComment);

    await expect(() =>
      sut.execute({
        commentId: exampleComment.id.toString(),
        authorId: 'other-author-id',
      }),
    ).rejects.toThrow('Comment not found');

    assertRepositorySpyNotCalled(sutRepositorySpy);
  });
});
