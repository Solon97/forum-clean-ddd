import { Mock } from 'vitest';
import { assertRepositorySpyCalled } from '@test/helpers/spy-helpers';
import { assertEitherIsRight } from '@test/helpers/assert-either';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';
import {
  AnswerQuestionUseCase,
  AnswerQuestionUseCaseInput,
} from './answer-question';
import type { AnswerRepository } from '@/domain/forum/repositories/answer-repository';

let inMemoryAnswerRepository: AnswerRepository;
let answerQuestionUseCase: AnswerQuestionUseCase;
let sutRepositorySpy: Mock<typeof inMemoryAnswerRepository.create>;

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    answerQuestionUseCase = new AnswerQuestionUseCase(inMemoryAnswerRepository);
    sutRepositorySpy = vi.spyOn(inMemoryAnswerRepository, 'create');
  });

  test('should be able to create an answer', async () => {
    const questionId = new UniqueEntityId().toString();
    const instructorId = new UniqueEntityId().toString();
    const input: AnswerQuestionUseCaseInput = {
      questionId,
      instructorId,
      content: 'This is an answer to the question.',
      attachmentIds: [],
    };

    const result = await answerQuestionUseCase.execute(input);

    assertEitherIsRight(result);
    assertRepositorySpyCalled(sutRepositorySpy);
    expect(result).toBeTruthy();
    expect(result.right.answer.id).toBeTruthy();
    expect(result.right.answer.content).toBe(input.content);
    expect(result.right.answer.questionId.toString()).toBe(input.questionId);
    expect(result.right.answer.authorId.toString()).toBe(input.instructorId);
    expect(result.right.answer.attachments.getItems()).toEqual([]);
  });

  test('should be able to create an answer with attachments', async () => {
    const questionId = new UniqueEntityId().toString();
    const instructorId = new UniqueEntityId().toString();
    const input: AnswerQuestionUseCaseInput = {
      questionId,
      instructorId,
      content: 'This is an answer to the question.',
      attachmentIds: [
        new UniqueEntityId().toString(),
        new UniqueEntityId().toString(),
      ],
    };

    const result = await answerQuestionUseCase.execute(input);

    assertEitherIsRight(result);
    assertRepositorySpyCalled(sutRepositorySpy);
    expect(result).toBeTruthy();
    expect(result.right.answer.attachments.getItems()).toHaveLength(2);
    expect(
      result.right.answer.attachments.getItems()[0]?.attachmentId.toString(),
    ).toBe(input.attachmentIds[0]);
    expect(
      result.right.answer.attachments.getItems()[1]?.attachmentId.toString(),
    ).toBe(input.attachmentIds[1]);
  });
});
