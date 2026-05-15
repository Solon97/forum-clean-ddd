import { makeAnswer } from '@test/factories/make-answer';
import {
  assertEitherIsLeft,
  assertEitherIsRight,
} from '@test/helpers/assert-either';
import {
  assertRepositorySpyCalled,
  assertRepositorySpyNotCalled,
} from '@test/helpers/spy-helpers';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { Mock } from 'vitest';
import { AnswerRepository } from '../repositories/answer-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { UpdateAnswerUseCase } from './update-answer';

let inMemoryAnswerRepository: AnswerRepository;
let sut: UpdateAnswerUseCase;
let sutRepositorySpy: Mock<typeof inMemoryAnswerRepository.update>;

describe('Update Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new UpdateAnswerUseCase(inMemoryAnswerRepository);
    sutRepositorySpy = vi.spyOn(inMemoryAnswerRepository, 'update');
  });

  it('should be able to update a answer', async () => {
    vi.useFakeTimers();
    const now = new Date('2026-01-01T00:00:00.000Z');
    vi.setSystemTime(now);
    const exampleAnswer = makeAnswer();
    await inMemoryAnswerRepository.create(exampleAnswer);
    const originalCreatedAt = exampleAnswer.createdAt.getTime();
    const originalUpdatedAt = exampleAnswer.updatedAt?.getTime() ?? 0;
    vi.advanceTimersByTime(1000);
    const result = await sut.execute({
      answerId: exampleAnswer.id.toString(),
      authorId: exampleAnswer.authorId.toString(),
      content: 'Updated Content',
    });
    assertEitherIsRight(result);
    assertRepositorySpyCalled(sutRepositorySpy, exampleAnswer);
    const updatedAnswer = await inMemoryAnswerRepository.findById(
      exampleAnswer.id.toString(),
    );
    expect(updatedAnswer).not.toBeNull();
    expect(updatedAnswer?.content).toBe('Updated Content');
    expect(updatedAnswer?.createdAt.getTime()).toBe(originalCreatedAt);
    expect(updatedAnswer?.updatedAt?.getTime()).toBeGreaterThan(
      originalUpdatedAt,
    );
  });

  it('should not be able to update a non existing answer', async () => {
    const result = await sut.execute({
      answerId: 'non-existing-answer-id',
      authorId: 'any-author-id',
      content: 'Content',
    });
    assertEitherIsLeft(result);
    expect(result.left).toBeInstanceOf(ResourceNotFoundError);
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });

  it('should not be able to update a answer from another author', async () => {
    const exampleAnswer = makeAnswer();
    await inMemoryAnswerRepository.create(exampleAnswer);
    const result = await sut.execute({
      answerId: exampleAnswer.id.toString(),
      authorId: 'other-author-id',
      content: 'Updated Content',
    });
    assertEitherIsLeft(result);
    expect(result.left).toBeInstanceOf(ResourceNotFoundError);
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });
});
