import { makeQuestion } from '@test/factories/make-question';
import {
  assertEitherIsLeft,
  assertEitherIsRight,
} from '@test/helpers/assert-either';
import {
  assertRepositorySpyCalled,
  assertRepositorySpyNotCalled,
} from '@test/helpers/spy-helpers';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';
import { Mock } from 'vitest';
import { QuestionRepository } from '../repositories/question-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { UpdateQuestionUseCase } from './update-question';

let inMemoryQuestionRepository: QuestionRepository;
let sut: UpdateQuestionUseCase;
let sutRepositorySpy: Mock<typeof inMemoryQuestionRepository.update>;

describe('Update Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new UpdateQuestionUseCase(inMemoryQuestionRepository);
    sutRepositorySpy = vi.spyOn(inMemoryQuestionRepository, 'update');
  });

  it('should be able to update a question', async () => {
    vi.useFakeTimers();
    const now = new Date('2026-01-01T00:00:00.000Z');
    vi.setSystemTime(now);
    const exampleQuestion = makeQuestion();
    await inMemoryQuestionRepository.create(exampleQuestion);
    const originalCreatedAt = exampleQuestion.createdAt.getTime();
    const originalUpdatedAt = exampleQuestion.updatedAt?.getTime() ?? 0;
    vi.advanceTimersByTime(1000);
    const result = await sut.execute({
      questionId: exampleQuestion.id.toString(),
      authorId: exampleQuestion.authorId.toString(),
      title: 'Updated Title',
      content: 'Updated Content',
    });
    assertEitherIsRight(result);
    assertRepositorySpyCalled(sutRepositorySpy, exampleQuestion);
    const updatedQuestion = await inMemoryQuestionRepository.findById(
      exampleQuestion.id.toString(),
    );
    expect(updatedQuestion).not.toBeNull();
    expect(updatedQuestion?.title).toBe('Updated Title');
    expect(updatedQuestion?.content).toBe('Updated Content');
    expect(updatedQuestion?.createdAt.getTime()).toBe(originalCreatedAt);
    expect(updatedQuestion?.updatedAt?.getTime()).toBeGreaterThan(
      originalUpdatedAt,
    );
  });

  it('should not be able to update a non existing question', async () => {
    const result = await sut.execute({
      questionId: 'non-existing-question-id',
      authorId: 'any-author-id',
      title: 'Title',
      content: 'Content',
    });
    assertEitherIsLeft(result);
    expect(result.left).toBeInstanceOf(ResourceNotFoundError);
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });

  it('should not be able to update a question from another author', async () => {
    const exampleQuestion = makeQuestion();
    await inMemoryQuestionRepository.create(exampleQuestion);
    const result = await sut.execute({
      questionId: exampleQuestion.id.toString(),
      authorId: 'other-author-id',
      title: 'Updated Title',
      content: 'Updated Content',
    });
    assertEitherIsLeft(result);
    expect(result.left).toBeInstanceOf(ResourceNotFoundError);
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });
});
