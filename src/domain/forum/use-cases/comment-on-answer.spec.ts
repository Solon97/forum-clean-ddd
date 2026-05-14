import { makeAnswer } from '@test/factories/make-answer';
import {
  assertRepositorySpyCalled,
  assertRepositorySpyNotCalled,
} from '@test/helpers/spy-helpers';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { Mock } from 'vitest';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';
import { AnswerRepository } from '../repositories/answer-repository';
import {
  CommentOnAnswerUseCase,
  CommentOnAnswerUseCaseInput,
} from './comment-on-answer';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';
import { InMemoryAnswerCommentRepository } from '@test/repositories/in-memory-answer-comment-repository';

let inMemoryAnswerRepository: AnswerRepository;
let inMemoryAnswerCommentRepository: AnswerCommentRepository;
let sut: CommentOnAnswerUseCase;
let sutRepositorySpy: Mock<typeof inMemoryAnswerCommentRepository.create>;

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentRepository,
    );
    sutRepositorySpy = vi.spyOn(inMemoryAnswerCommentRepository, 'create');
  });

  it('should be able to comment on a answer', async () => {
    const exampleAnswer = makeAnswer();
    await inMemoryAnswerRepository.create(exampleAnswer);
    const input: CommentOnAnswerUseCaseInput = {
      content: 'This is a comment',
      answerId: exampleAnswer.id.toString(),
      authorId: new UniqueEntityId().toString(),
    };

    const result = await sut.execute(input);

    assertRepositorySpyCalled(sutRepositorySpy);
    expect(result.comment.id).toBeTruthy();
    expect(result.comment.content).toBe('This is a comment');
    expect(result.comment.answerId.toString()).toBe(
      exampleAnswer.id.toString(),
    );
    expect(result.comment.authorId.toString()).toBe(input.authorId);
  });

  it('should not be able to comment on a non existing answer', async () => {
    await expect(() =>
      sut.execute({
        content: 'This is a comment',
        answerId: 'non-existing-answer-id',
        authorId: 'any-author-id',
      }),
    ).rejects.toThrow('Answer not found');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });
});
