import { Mock } from 'vitest';
import { makeAnswer } from '@test/factories/make-answer';
import {
  assertRepositorySpyCalled,
  assertRepositorySpyNotCalled,
} from '@test/helpers/spy-helpers';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { AnswerRepository } from '../repositories/answer-repository';
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
    await sut.execute({
      answerId: exampleAnswer.id.toString(),
      authorId: exampleAnswer.authorId.toString(),
      content: 'Updated Content',
    });
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
    await expect(() =>
      sut.execute({
        answerId: 'non-existing-answer-id',
        authorId: 'any-author-id',
        content: 'Content',
      }),
    ).rejects.toThrow('Answer not found');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });

  it('should not be able to update a answer from another author', async () => {
    const exampleAnswer = makeAnswer();
    await inMemoryAnswerRepository.create(exampleAnswer);
    await expect(() =>
      sut.execute({
        answerId: exampleAnswer.id.toString(),
        authorId: 'other-author-id',
        content: 'Updated Content',
      }),
    ).rejects.toThrow('Answer not found');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });
});
