import { makeAnswer } from '@test/factories/make-answer';
import {
  assertRepositorySpyCalled,
  assertRepositorySpyNotCalled,
} from '@test/helpers/spy-helpers';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';
import { Mock } from 'vitest';
import { AnswerRepository } from '../repositories/answer-repository';
import { QuestionRepository } from '../repositories/question-repository';
import { SetBestAnswerUseCase } from './set-best-answer';
import { makeQuestion } from '@test/factories/make-question';

let inMemoryQuestionRepository: QuestionRepository;
let inMemoryAnswerRepository: AnswerRepository;
let sut: SetBestAnswerUseCase;
let sutRepositorySpy: Mock<typeof inMemoryQuestionRepository.update>;

describe('Set Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new SetBestAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryQuestionRepository,
    );
    sutRepositorySpy = vi.spyOn(inMemoryQuestionRepository, 'update');
  });

  it('should be able to set the best answer for a question', async () => {
    vi.useFakeTimers();
    const now = new Date('2026-01-01T00:00:00.000Z');
    vi.setSystemTime(now);

    const exampleQuestion = makeQuestion();
    const exampleAnswer = makeAnswer({ questionId: exampleQuestion.id });
    await inMemoryQuestionRepository.create(exampleQuestion);
    await inMemoryAnswerRepository.create(exampleAnswer);
    const originalCreatedAt = exampleQuestion.createdAt.getTime();
    const originalUpdatedAt = exampleQuestion.updatedAt?.getTime() ?? 0;

    vi.advanceTimersByTime(1000);
    await sut.execute({
      answerId: exampleAnswer.id.toString(),
      authorId: exampleQuestion.authorId.toString(),
    });

    assertRepositorySpyCalled(sutRepositorySpy, exampleQuestion);
    const updatedQuestion = await inMemoryQuestionRepository.findById(
      exampleQuestion.id.toString(),
    );
    expect(updatedQuestion).not.toBeNull();
    expect(updatedQuestion?.bestAnswerId?.toString()).toBe(
      exampleAnswer.id.toString(),
    );
    expect(updatedQuestion?.createdAt.getTime()).toBe(originalCreatedAt);
    expect(updatedQuestion?.updatedAt?.getTime()).toBeGreaterThan(
      originalUpdatedAt,
    );
  });

  it('should not be able to set the best answer for a non existing answer', async () => {
    await expect(() =>
      sut.execute({
        answerId: 'non-existing-answer-id',
        authorId: 'any-author-id',
      }),
    ).rejects.toThrow('Answer not found');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });

  it('should not be able to set the best answer for a non existing question', async () => {
    const exampleAnswer = makeAnswer();
    await inMemoryAnswerRepository.create(exampleAnswer);
    await expect(() =>
      sut.execute({
        answerId: exampleAnswer.id.toString(),
        authorId: 'any-author-id',
      }),
    ).rejects.toThrow('Question not found');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });

  it('should not be able to set the best answer for a question from another author', async () => {
    const exampleQuestion = makeQuestion();
    const exampleAnswer = makeAnswer({ questionId: exampleQuestion.id });
    await inMemoryQuestionRepository.create(exampleQuestion);
    await inMemoryAnswerRepository.create(exampleAnswer);
    await expect(() =>
      sut.execute({
        answerId: exampleAnswer.id.toString(),
        authorId: 'other-author-id',
      }),
    ).rejects.toThrow('Not allowed');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });
});
