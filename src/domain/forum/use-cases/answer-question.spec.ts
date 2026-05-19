import { Mock } from 'vitest';
import { assertRepositorySpyCalled } from '@test/helpers/spy-helpers';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';
import {
  AnswerQuestionUseCase,
  AnswerQuestionUseCaseInput,
  AnswerQuestionUseCaseOutput,
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

    const output: AnswerQuestionUseCaseOutput =
      await answerQuestionUseCase.execute(input);

    assertRepositorySpyCalled(sutRepositorySpy);
    expect(output).toBeTruthy();
    expect(output.answer.id).toBeTruthy();
    expect(output.answer.content).toBe(input.content);
    expect(output.answer.questionId.toString()).toBe(input.questionId);
    expect(output.answer.authorId.toString()).toBe(input.instructorId);
    expect(output.answer.attachments).toEqual([]);
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

    const output: AnswerQuestionUseCaseOutput =
      await answerQuestionUseCase.execute(input);

    assertRepositorySpyCalled(sutRepositorySpy);
    expect(output).toBeTruthy();
    expect(output.answer.attachments.getItems()).toHaveLength(2);
    expect(
      output.answer.attachments.getItems()[0]?.attachmentId.toString(),
    ).toBe(input.attachmentIds[0]);
    expect(
      output.answer.attachments.getItems()[1]?.attachmentId.toString(),
    ).toBe(input.attachmentIds[1]);
  });
});
